import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UiState } from "../types";

const initialState: UiState = {
  todoInEdit: null,
  taskSyncErrorIds: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startEditing(state, action: PayloadAction<{ id: string; title: string }>) {
      state.todoInEdit = { id: action.payload.id, title: action.payload.title };
    },
    setTaskSyncErrors(state, action: PayloadAction<string[]>) {
      state.taskSyncErrorIds = action.payload;
    },
  },
});

export const { startEditing, setTaskSyncErrors } = uiSlice.actions;

export default uiSlice.reducer;
