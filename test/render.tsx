// Test helper: render a component inside the real Redux store (optionally seeded
// with state) plus user-event, so UI tests read as one call. Prefer this over
// @testing-library/react's bare render for anything that touches the store.
import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "../src/redux/store";
import type { GlobalState, Todo, TodoList } from "../src/redux/types";

interface RenderWithStoreOptions extends Omit<RenderOptions, "wrapper"> {
  // Seed the `global` slice. If omitted, the slice starts from its initialState
  // (one empty list). Pass a partial and it's filled in around a fresh list.
  preloadedState?: { global: GlobalState };
  // Reuse a store across renders/rerenders when you need to dispatch in a test.
  store?: AppStore;
}

export function renderWithStore(
  ui: ReactElement,
  { preloadedState, store = makeStore(preloadedState), ...options }: RenderWithStoreOptions = {},
) {
  const user = userEvent.setup();
  const result = render(<Provider store={store}>{ui}</Provider>, options);
  return { store, user, ...result };
}

// Build a GlobalState with the given todos in a single active list. Ids default
// to t1, t2, ... so tests can reference them without wiring up random keys.
export function makeGlobalState(
  todos: Array<Partial<Todo> & { title: string }>,
  listId = "list1",
): GlobalState {
  const entries: Record<string, Todo> = {};
  const todoIds: string[] = [];
  todos.forEach((todo, i) => {
    const id = todo.id ?? `t${i + 1}`;
    entries[id] = { id, title: todo.title, isCompleted: todo.isCompleted ?? false };
    todoIds.push(id);
  });
  const list: TodoList = { id: listId, todoIds, isSyncedWithChrome: true };
  return { todos: entries, todoLists: { [listId]: list }, activeListId: listId };
}

// Re-export the testing-library surface so tests import everything from here.
export * from "@testing-library/react";
export { userEvent };
