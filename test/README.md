# Testing

UI tests run under **Vitest + jsdom + Testing Library**. No browser, no build, no
`npx` installs per run — everything is a devDependency in `node_modules`.

## Commands

| Command | What it does |
| --- | --- |
| `npm test` | Run all tests once |
| `npm run test:watch` | Re-run on file change |
| `npm run test:types` | Typecheck the test tree (`tsconfig.vitest.json`) |
| `npx vitest run src/components/Application.test.tsx` | Run a single file |

## Layout

- `test/setup.ts` — global setup: installs the chrome mock and jest-dom matchers,
  resets storage + unmounts the DOM between tests.
- `test/chrome-mock.ts` — in-memory `chrome.storage.*` (local/sync) with the real
  MV3 quota constants. jsdom has no `chrome`, and modules read quota constants at
  import time, so this must exist before app modules load.
- `test/render.tsx` — `renderWithStore(ui, { preloadedState })` wraps a component
  in the real Redux store + user-event; `makeGlobalState([...])` seeds tasks.
- `src/**/*.test.tsx` — component tests live next to the code. See
  `src/components/Application.test.tsx` for the template.

## Writing a test

```tsx
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";
import { renderWithStore, makeGlobalState, screen } from "../../test/render";

it("does the thing", async () => {
  const { user, store } = renderWithStore(<MyComponent />, {
    preloadedState: { global: makeGlobalState([{ title: "Task A" }]) },
  });

  await user.click(screen.getByRole("button", { name: "Delete task" }));

  expect(screen.queryByText("Task A")).not.toBeInTheDocument();
});
```

Query by accessible role/text (`getByRole`, `getByText`, `getByPlaceholderText`),
drive interaction with `user`, and assert on the DOM or `store.getState()`.

Note: test files use the automatic JSX runtime, so no `import React` is needed
(the app itself still uses the classic runtime — unaffected).
