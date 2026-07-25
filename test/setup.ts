// Runs once before the test modules are imported (vitest.config.ts -> setupFiles).
// Order matters: the chrome mock must be on globalThis before any app module is
// imported, because modules like src/storage/quotas.ts read chrome.storage.* at
// import time.
import { installChromeMock } from "./chrome-mock";

installChromeMock();

// jest-dom matchers (toBeInTheDocument, toHaveTextContent, ...) for expect().
import "@testing-library/jest-dom/vitest";

import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Fresh storage + unmounted DOM for every test, so tests can't leak into each other.
beforeEach(() => {
  installChromeMock();
});

afterEach(() => {
  cleanup();
});
