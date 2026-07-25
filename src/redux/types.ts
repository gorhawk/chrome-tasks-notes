export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TodoList {
  id: string;
  todoIds: string[];
  isSyncedWithChrome: boolean;
}

export interface GlobalState {
  todos: Record<string, Todo>;
  todoLists: Record<string, TodoList>;
  activeListId: string;
}

export interface UiState {
  taskSyncErrorIds: string[];
  history: GlobalState[];
}
