import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GlobalState, UiState } from "../types";

// How many past states to keep for undo. Whole-state snapshots, not patches --
// the app's task count is small (see MAX_TASK_COUNT), so this is cheap.
const HISTORY_LIMIT = 20;

const initialState: UiState = {
  taskSyncErrorIds: [],
  history: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTaskSyncErrors(state, action: PayloadAction<string[]>) {
      state.taskSyncErrorIds = action.payload;
    },
    pushHistory(state, action: PayloadAction<GlobalState>) {
      state.history.push(action.payload);
      if (state.history.length > HISTORY_LIMIT) {
        state.history.shift();
      }
    },
    popHistory(state) {
      state.history.pop();
    },
  },
});

export const { setTaskSyncErrors, pushHistory, popHistory } = uiSlice.actions;

export default uiSlice.reducer;
