import { defineConfig } from "vitest/config";

// Tests run under Vitest + jsdom. We deliberately do NOT load the Tailwind Vite
// plugin here: tests assert on DOM structure/behaviour, not compiled CSS, so
// skipping it keeps runs fast. Component tests live in src/**/*.test.tsx.
export default defineConfig({
  // Use the automatic JSX runtime in tests so test files don't each need to
  // `import React`. (The app itself uses the classic runtime; that's unaffected --
  // this only governs how Vitest transforms .tsx here.)
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}", "test/**/*.{test,spec}.{ts,tsx}"],
  },
});
