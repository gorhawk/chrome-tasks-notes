import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  toggleTodo,
  removeTodo,
  clearCompletedTodos,
  moveTodoInList,
  addTodo,
  changeTodo,
} from "./todosSlice";
import { setTaskSyncErrors } from "./ui/uiSlice";
import { saveState, syncLocalStorage } from "../storage/storage";
import type { AppDispatch, RootState } from "./store";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(
    toggleTodo,
    removeTodo,
    clearCompletedTodos,
    moveTodoInList,
    addTodo,
    changeTodo,
  ),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const dispatch = listenerApi.dispatch as AppDispatch;
    saveState(state.global);
    syncLocalStorage(({ failedTaskIds }) => {
      dispatch(setTaskSyncErrors(failedTaskIds));
    });
  },
});
