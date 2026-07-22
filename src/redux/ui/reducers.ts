import initialState from "./initialState";
import createReducerMappingApplication from "../reducerMapping";
import { START_EDITING, SET_TASK_SYNC_ERRORS } from "./actions";

const actionReducerMap = {};

actionReducerMap[START_EDITING] = (state, action) => ({
  ...state,
  todoInEdit: {
    id: action.todoId,
    title: action.title,
  },
});

actionReducerMap[SET_TASK_SYNC_ERRORS] = (state, action) => ({
  ...state,
  taskSyncErrorIds: action.taskIds,
});

const applyReducerMapping = createReducerMappingApplication(
  initialState,
  actionReducerMap,
);
const uiReducer = (state, action) => applyReducerMapping(state, action);

export default uiReducer;
