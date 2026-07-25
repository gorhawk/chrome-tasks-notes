// In-memory stand-in for the parts of the `chrome.*` extension API this app uses.
// jsdom has no `chrome` global, and several modules read quota constants off
// `chrome.storage.sync` at import time (see src/storage/quotas.ts), so this mock
// has to exist before any app module is imported -- test/setup.ts installs it.
//
// Storage is a plain in-memory object per area. get/set/remove/clear accept the
// same callback-style signatures the app relies on and invoke them async-ish via
// queueMicrotask so tests see realistic ordering.

type StoreData = Record<string, unknown>;

// Real Chrome Manifest V3 sync quotas -- see src/storage/quotas.ts.
const SYNC_QUOTAS = {
  QUOTA_BYTES: 102400,
  QUOTA_BYTES_PER_ITEM: 8192,
  MAX_ITEMS: 512,
  MAX_WRITE_OPERATIONS_PER_MINUTE: 120,
  MAX_WRITE_OPERATIONS_PER_HOUR: 1800,
} as const;

const LOCAL_QUOTAS = {
  QUOTA_BYTES: 10485760,
} as const;

function pick(store: StoreData, keys: string | string[] | null): StoreData {
  if (keys === null || keys === undefined) {
    return { ...store };
  }
  const list = Array.isArray(keys) ? keys : [keys];
  const out: StoreData = {};
  for (const key of list) {
    if (key in store) out[key] = store[key];
  }
  return out;
}

function makeArea(quotas: Record<string, number>) {
  const store: StoreData = {};
  return {
    ...quotas,
    // Direct handle to the backing object so tests can seed/inspect state.
    __store: store,
    get(keys: any, cb?: (items: StoreData) => void) {
      const result = pick(store, typeof keys === "function" ? null : keys);
      const callback = typeof keys === "function" ? keys : cb;
      queueMicrotask(() => callback?.(result));
    },
    set(items: StoreData, cb?: () => void) {
      Object.assign(store, items);
      queueMicrotask(() => cb?.());
    },
    remove(keys: string | string[], cb?: () => void) {
      const list = Array.isArray(keys) ? keys : [keys];
      for (const key of list) delete store[key];
      queueMicrotask(() => cb?.());
    },
    clear(cb?: () => void) {
      for (const key of Object.keys(store)) delete store[key];
      queueMicrotask(() => cb?.());
    },
  };
}

export type ChromeMock = ReturnType<typeof createChromeMock>;

export function createChromeMock() {
  return {
    runtime: {
      lastError: undefined as { message: string } | undefined,
    },
    storage: {
      local: makeArea(LOCAL_QUOTAS),
      sync: makeArea(SYNC_QUOTAS),
      // Referenced by the bundled largeSync shim (src/lib/largeSync.ts) at import time.
      onChanged: {
        addListener() {},
        removeListener() {},
      },
    },
  };
}

// Installs a fresh mock on globalThis.chrome and returns it. Call between tests
// to reset storage. Cast keeps @types/chrome happy without mocking every member.
export function installChromeMock(): ChromeMock {
  const mock = createChromeMock();
  (globalThis as any).chrome = mock;
  return mock;
}
