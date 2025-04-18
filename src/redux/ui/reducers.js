import initialState from "./initialState";
import createReducerMappingApplication from "../reducerMapping";
import { START_EDITING } from "./actions";

const actionReducerMap = {};

actionReducerMap[START_EDITING] = (state, action) => ({
  ...state,
  todoInEdit: {
    id: action.todoId,
    title: action.title,
  },
});

const applyReducerMapping = createReducerMappingApplication(
  initialState,
  actionReducerMap,
);
const uiReducer = (state, action) => applyReducerMapping(state, action);

export default uiReducer;
