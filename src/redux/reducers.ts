import * as Actions from "./actions.js";
import { omit, without, clamp, todoOccurrenceCount } from "../../utility.js";
import createReducerMappingApplication from "./reducerMapping.js";
import initialState from "./initialState.js";

const actionReducerMap = {};

actionReducerMap[Actions.TOGGLE_TODO] = (state, action) => ({
  ...state,
  todos: {
    ...state.todos,
    [action.id]: {
      ...state.todos[action.id],
      isCompleted: !state.todos[action.id].isCompleted,
    },
  },
});

const removeTodoFromList = (state, listId, todoId) => {
  const list = state.todoLists[listId];
  const todoIndex = list.todoIds.indexOf(todoId);
  const occurrenceCount = todoOccurrenceCount(state.todoLists, todoId);
  return {
    ...state,
    todos: occurrenceCount === 1 ? omit(state.todos, todoId) : state.todos,
    todoLists: {
      ...state.todoLists,
      [listId]: {
        ...list,
        todoIds: without(list.todoIds, todoIndex),
      },
    },
  };
};

actionReducerMap[Actions.REMOVE_TODO] = (state, action) =>
  removeTodoFromList(state, action.listId, action.id);

actionReducerMap[Actions.CLEAR_COMPLETED_TODOS] = (state, action) => {
  let newState = state;
  const list = state.todoLists[action.listId];
  Object.keys(state.todos)
    .filter(
      (todoId) =>
        state.todos[todoId].isCompleted && list.todoIds.includes(todoId),
    )
    .forEach((todoId) => {
      newState = removeTodoFromList(newState, action.listId, todoId);
    });
  return newState;
};

actionReducerMap[Actions.MOVE_TODO_IN_LIST] = (state, action) => {
  const list = state.todoLists[action.listId];
  const todoIndex = list.todoIds.indexOf(action.id);
  const todoIds = without(list.todoIds, todoIndex);
  todoIds.splice(action.targetIndex, 0, action.id);
  return {
    ...state,
    todoLists: {
      ...state.todoLists,
      [action.listId]: {
        ...list,
        todoIds,
      },
    },
  };
};

actionReducerMap[Actions.ADD_TODO] = (state, action) => ({
  ...state,
  todos: {
    ...state.todos,
    [action.id]: {
      id: action.id,
      title: action.title,
      isCompleted: false,
    },
  },
  todoLists: {
    ...state.todoLists,
    [action.listId]: {
      ...state.todoLists[action.listId],
      todoIds: [...state.todoLists[action.listId].todoIds, action.id],
    },
  },
});

actionReducerMap[Actions.CHANGE_TODO] = (state, action) => ({
  ...state,
  todos: {
    ...state.todos,
    [action.id]: {
      id: action.id,
      ...action.newProps,
    },
  },
});

const applyReducerMapping = createReducerMappingApplication(
  initialState,
  actionReducerMap,
);
const globalReducer = (state, action) => applyReducerMapping(state, action);

export default globalReducer;
