export const START_EDITING = "START_EDITING";
export const SET_TASK_SYNC_ERRORS = "SET_TASK_SYNC_ERRORS";

export const startEditing = (id) => ({ type: START_EDITING });

export const setTaskSyncErrors = (taskIds) => ({
  type: SET_TASK_SYNC_ERRORS,
  taskIds,
});
