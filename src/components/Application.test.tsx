// Sample UI test suite -- also the template to copy for new component tests.
// Run with `npm test` (single run) or `npm run test:watch` (re-runs on save).
//
// The pattern:
//   1. renderWithStore(<Component/>, { preloadedState }) mounts it in the real
//      Redux store, seeded via makeGlobalState.
//   2. Query the DOM with screen.getBy* / findBy* (accessible roles/text).
//   3. Drive interactions with `user` (real click/type events).
//   4. Assert on the DOM, or on store.getState() for state changes.
import { describe, it, expect } from "vitest";
import Application from "./Application";
import { renderWithStore, makeGlobalState, screen } from "../../test/render";

describe("Application", () => {
  it("renders the seeded tasks", () => {
    renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ title: "Buy milk" }, { title: "Walk dog" }]),
      },
    });

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Walk dog")).toBeInTheDocument();
  });

  it("adds a task when typing and pressing Enter", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: { global: makeGlobalState([]) },
    });

    const input = screen.getByPlaceholderText("Add a task");
    await user.type(input, "Write tests{Enter}");

    expect(screen.getByText("Write tests")).toBeInTheDocument();
    const todos = Object.values(store.getState().global.todos);
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe("Write tests");
  });

  it("toggles a task complete when its row is clicked", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ id: "t1", title: "Buy milk" }]),
      },
    });

    // Clicking the row toggles completion. NB: clicking the title text itself
    // opens the inline editor instead (it stops propagation) -- so target the
    // row, not the text.
    const row = screen.getByText("Buy milk").closest("div.select-none")!;
    await user.click(row);

    expect(store.getState().global.todos.t1.isCompleted).toBe(true);
  });

  it("deletes a task via its delete button", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ id: "t1", title: "Buy milk" }]),
      },
    });

    await user.click(screen.getByRole("button", { name: "Delete task" }));

    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
    expect(store.getState().global.todos.t1).toBeUndefined();
  });

  it("commits a new title when editing and pressing Enter", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ id: "t1", title: "Buy milk" }]),
      },
    });

    await user.click(screen.getByText("Buy milk"));
    const input = screen.getByDisplayValue("Buy milk");
    await user.clear(input);
    await user.type(input, "Buy oat milk{Enter}");

    expect(screen.getByText("Buy oat milk")).toBeInTheDocument();
    expect(store.getState().global.todos.t1.title).toBe("Buy oat milk");
  });

  it("discards edits and keeps the original title when Escape is pressed", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ id: "t1", title: "Buy milk" }]),
      },
    });

    await user.click(screen.getByText("Buy milk"));
    const input = screen.getByDisplayValue("Buy milk");
    await user.clear(input);
    await user.type(input, "Ignore me{Escape}");

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.queryByText("Ignore me")).not.toBeInTheDocument();
    expect(store.getState().global.todos.t1.title).toBe("Buy milk");
  });

  it("commits edits when the input is blurred", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ id: "t1", title: "Buy milk" }]),
      },
    });

    await user.click(screen.getByText("Buy milk"));
    const input = screen.getByDisplayValue("Buy milk");
    await user.clear(input);
    await user.type(input, "Buy oat milk");
    await user.tab();

    expect(screen.getByText("Buy oat milk")).toBeInTheDocument();
    expect(store.getState().global.todos.t1.title).toBe("Buy oat milk");
  });

  it("clears completed tasks with the Clear completed button", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([
          { id: "t1", title: "Done thing", isCompleted: true },
          { id: "t2", title: "Pending thing", isCompleted: false },
        ]),
      },
    });

    await user.click(screen.getByRole("button", { name: "Clear completed" }));

    expect(screen.queryByText("Done thing")).not.toBeInTheDocument();
    expect(screen.getByText("Pending thing")).toBeInTheDocument();
    expect(Object.keys(store.getState().global.todos)).toEqual(["t2"]);
  });

  it("disables the Undo button when there is no history", () => {
    renderWithStore(<Application />, {
      preloadedState: { global: makeGlobalState([{ id: "t1", title: "Buy milk" }]) },
    });

    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
  });

  it("restores a deleted task via the Undo button", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ id: "t1", title: "Buy milk" }]),
      },
    });

    await user.click(screen.getByRole("button", { name: "Delete task" }));
    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Undo" }));

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(store.getState().global.todos.t1.title).toBe("Buy milk");
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
  });

  it("restores every task cleared by Clear completed in a single undo", async () => {
    const { user } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([
          { id: "t1", title: "Done thing", isCompleted: true },
          { id: "t2", title: "Also done", isCompleted: true },
          { id: "t3", title: "Pending thing", isCompleted: false },
        ]),
      },
    });

    await user.click(screen.getByRole("button", { name: "Clear completed" }));
    expect(screen.queryByText("Done thing")).not.toBeInTheDocument();
    expect(screen.queryByText("Also done")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Undo" }));

    expect(screen.getByText("Done thing")).toBeInTheDocument();
    expect(screen.getByText("Also done")).toBeInTheDocument();
    expect(screen.getByText("Pending thing")).toBeInTheDocument();
  });

  it("undoes with the Ctrl+Z keyboard shortcut", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ id: "t1", title: "Buy milk" }]),
      },
    });

    await user.click(screen.getByRole("button", { name: "Delete task" }));
    await user.keyboard("{Control>}z{/Control}");

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(store.getState().global.todos.t1.title).toBe("Buy milk");
  });

  it("does not trigger the global undo shortcut while typing in a text field", async () => {
    const { user, store } = renderWithStore(<Application />, {
      preloadedState: {
        global: makeGlobalState([{ id: "t1", title: "Buy milk" }]),
      },
    });

    await user.click(screen.getByRole("button", { name: "Delete task" }));

    const addInput = screen.getByPlaceholderText("Add a task");
    await user.click(addInput);
    await user.keyboard("{Control>}z{/Control}");

    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
    expect(store.getState().global.todos.t1).toBeUndefined();
    expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled();
  });
});
