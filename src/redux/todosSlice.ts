import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  generateRandomKey,
  generateRandomKeys,
  todoOccurrenceCount,
} from "../../utility.js";
import { MAX_TASK_COUNT } from "../storage/quotas";
import type { GlobalState } from "./types";
import type { AppThunk } from "./store";

const initialListId = generateRandomKey();

const initialState: GlobalState = {
  todos: {},
  todoLists: {
    [initialListId]: {
      id: initialListId,
      todoIds: [],
      isSyncedWithChrome: true,
    },
  },
  activeListId: initialListId,
};

const removeTodoFromList = (
  state: GlobalState,
  listId: string,
  todoId: string,
) => {
  const list = state.todoLists[listId];
  const occurrenceCount = todoOccurrenceCount(state.todoLists, todoId);
  list.todoIds = list.todoIds.filter((id) => id !== todoId);
  if (occurrenceCount === 1) {
    delete state.todos[todoId];
  }
};

const todosSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos[action.payload];
      todo.isCompleted = !todo.isCompleted;
    },
    removeTodo(
      state,
      action: PayloadAction<{ id: string; listId: string }>,
    ) {
      removeTodoFromList(state, action.payload.listId, action.payload.id);
    },
    clearCompletedTodos(state, action: PayloadAction<string>) {
      const listId = action.payload;
      const list = state.todoLists[listId];
      const completedIds = list.todoIds.filter(
        (todoId) => state.todos[todoId].isCompleted,
      );
      completedIds.forEach((todoId) => removeTodoFromList(state, listId, todoId));
    },
    moveTodoInList(
      state,
      action: PayloadAction<{ id: string; listId: string; targetIndex: number }>,
    ) {
      const { id, listId, targetIndex } = action.payload;
      const list = state.todoLists[listId];
      list.todoIds = list.todoIds.filter((todoId) => todoId !== id);
      list.todoIds.splice(targetIndex, 0, id);
    },
    addTodo(
      state,
      action: PayloadAction<{ id: string; title: string; listId: string }>,
    ) {
      const { id, title, listId } = action.payload;
      state.todos[id] = { id, title, isCompleted: false };
      state.todoLists[listId].todoIds.push(id);
    },
    changeTodo(
      state,
      action: PayloadAction<{ id: string; newProps: Record<string, unknown> }>,
    ) {
      const { id, newProps } = action.payload;
      state.todos[id] = { ...state.todos[id], id, ...newProps };
    },
  },
});

export const {
  toggleTodo,
  removeTodo,
  clearCompletedTodos,
  moveTodoInList,
  addTodo,
  changeTodo,
} = todosSlice.actions;

export const addTodoThunk =
  (title: string, listId: string): AppThunk =>
  (dispatch, getState) => {
    const state = getState().global;
    const existingTodoIds = Object.keys(state.todos);
    if (existingTodoIds.length >= MAX_TASK_COUNT) {
      console.warn(
        `task limit reached (${MAX_TASK_COUNT}) - not adding another task`,
      );
      return;
    }
    const existingTodoListIds = Object.keys(state.todoLists);
    const id = generateRandomKeys(1, [
      ...existingTodoListIds,
      ...existingTodoIds,
    ]) as string;
    dispatch(addTodo({ id, title, listId }));
  };

export default todosSlice.reducer;
