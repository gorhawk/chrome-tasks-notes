import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  toggleTodo,
  removeTodo,
  clearCompletedTodos,
  moveTodoInList,
  addTodo,
  changeTodo,
  restoreGlobalState,
} from "./todosSlice";
import { setTaskSyncErrors, pushHistory } from "./ui/uiSlice";
import { saveState, syncLocalStorage } from "../storage/storage";
import type { AppDispatch, RootState } from "./store";

export const listenerMiddleware = createListenerMiddleware();

// Actions the user directly causes by editing their list. Every one of these
// gets persisted, and (below) gets a pre-action snapshot pushed for undo.
const isUndoableUserAction = isAnyOf(
  toggleTodo,
  removeTodo,
  clearCompletedTodos,
  moveTodoInList,
  addTodo,
  changeTodo,
);

listenerMiddleware.startListening({
  // Also persists restoreGlobalState (undo) -- it changes state.global just
  // like the actions above, so it needs to be saved/synced too.
  matcher: isAnyOf(isUndoableUserAction, restoreGlobalState),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const dispatch = listenerApi.dispatch as AppDispatch;
    saveState(state.global);
    syncLocalStorage(({ failedTaskIds }) => {
      dispatch(setTaskSyncErrors(failedTaskIds));
    });
  },
});

listenerMiddleware.startListening({
  // Deliberately excludes restoreGlobalState -- undoing pops the history
  // stack, it shouldn't also push a new entry onto it.
  matcher: isUndoableUserAction,
  effect: (_action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const previousState = listenerApi.getOriginalState() as RootState;
    dispatch(pushHistory(previousState.global));
  },
});
