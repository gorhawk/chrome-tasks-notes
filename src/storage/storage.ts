import { largeSync } from "../lib/largeSync";
import { SYNC_QUOTA_BYTES_PER_ITEM } from "./quotas";

largeSync && console.debug("largeSync module loaded");

const STORAGE_KEY = "tasks_notes_tab";
const STORAGE_KEY_OLD_LARGESYNC = "simpleTaskManagerData";

// Every task gets its own chrome.storage.sync item, so one task's text isn't limited by the
// size of every other task combined. STORAGE_KEY holds only the index needed to find them:
// { todoIds, todoLists, activeListId }.
const TASK_KEY_PREFIX = "task__";
const taskKey = (id: string) => `${TASK_KEY_PREFIX}${id}`;
const isTaskKey = (key: string) => key.startsWith(TASK_KEY_PREFIX);
const taskIdFromKey = (key: string) => key.slice(TASK_KEY_PREFIX.length);

const QUOTA = SYNC_QUOTA_BYTES_PER_ITEM;
const QUOTA_MARGIN = 8;

function byteLength(str: string): number {
  const encoder = new TextEncoder();
  return encoder.encode(str).length;
}

// Stages a single sync storage item, or warns and returns undefined if it can't fit in one item.
// No chunking/splitting -- if a single task's text is this long, we just skip syncing it.
function stageString(
  key: string,
  data: string,
): Record<string, string> | undefined {
  const bytes = byteLength(key.concat(data));
  if (bytes + QUOTA_MARGIN > QUOTA) {
    console.error(
      `"${key}" is too large to sync (${bytes} bytes, limit ${QUOTA}) - skipping it this sync cycle.`,
    );
    return undefined;
  }
  return { [key]: data };
}

export const saveState = (state) => {
  chrome.storage.local.set({ [STORAGE_KEY]: state }, () => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      console.error(lastError);
    } else {
      console.debug("saved locally", state);
    }
  });
};

const loadLargeSyncState = () =>
  new Promise((resolve, reject) => {
    (chrome.storage as any).largeSync.get(null, (data) => {
      try {
        if (data && Object.keys(data).length > 0) {
          console.log("salvaged old data from sync with LargeSync", data);
          resolve(data[STORAGE_KEY_OLD_LARGESYNC]);
          (chrome.storage as any).largeSync.clear(() => {
            console.debug("cleared old data from LargeSync", data);
          });
          return;
        }
        console.debug("old data in LargeSync not found or empty");
        resolve(undefined);
      } catch (error) {
        reject(error);
      }
    });
  });

// todo make it a promise
export const loadState = async (callback) => {
  if (typeof callback !== "function") {
    console.error("Callback given to loadState is not a function.", callback);
    return;
  }
  try {
    const oldData = await loadLargeSyncState();
    if (oldData) {
      console.debug(
        "loading largeSync data format, skipping check for new data in plain format",
        oldData,
      );
      callback(oldData);
      return;
    }
    chrome.storage.sync.get(null, (data) => {
      console.log("initial data retrieved from plain sync storage", data);
      if (!data || Object.keys(data).length === 0 || !data[STORAGE_KEY]) {
        console.debug(
          "initial data from sync is empty, trying local storage",
          data,
        );
        chrome.storage.local.get(STORAGE_KEY, (items) => {
          console.debug("unconditional load from local storage", data);
          callback(items[STORAGE_KEY]);
        });
        return;
      }

      const index = JSON.parse(data[STORAGE_KEY]);
      if (index.todos) {
        // Old, pre-sharding shape (whole state under one key). Use directly; the next save
        // migrates it forward into the sharded shape.
        callback(index);
        return;
      }

      const todos: Record<string, any> = {};
      (index.todoIds || []).forEach((id: string) => {
        const raw = data[taskKey(id)];
        if (raw === undefined) {
          console.error("missing synced task data for id, skipping", id);
          return;
        }
        todos[id] = JSON.parse(raw);
      });

      callback({
        todos,
        todoLists: index.todoLists,
        activeListId: index.activeListId,
      });
    });
  } catch (error) {
    console.error("failed loading data from either sync storage", error);
    callback(undefined);
  }
};

// callback receives the ids of tasks that couldn't be synced this round (too large to fit in
// one sync item), so the UI can signal it -- see actions.ts's initiateSave.
export const syncLocalStorage = (
  callback?: (result: { lastError?: any; failedTaskIds: string[] }) => void,
) => {
  chrome.storage.local.get(STORAGE_KEY, (localItems: any) => {
    const state = localItems[STORAGE_KEY];
    if (!state) {
      return;
    }

    const { todos, todoLists, activeListId } = state;
    const todoIds = Object.keys(todos);
    const failedTaskIds: string[] = [];

    const itemsToSet: Record<string, string> = {};
    const stagedIndex = stageString(
      STORAGE_KEY,
      JSON.stringify({ todoIds, todoLists, activeListId }),
    );
    if (stagedIndex) Object.assign(itemsToSet, stagedIndex);

    todoIds.forEach((id: string) => {
      const stagedTask = stageString(taskKey(id), JSON.stringify(todos[id]));
      if (stagedTask) {
        Object.assign(itemsToSet, stagedTask);
      } else {
        failedTaskIds.push(id);
      }
    });

    chrome.storage.sync.get(null, (existing: any) => {
      const staleKeys = Object.keys(existing).filter(
        (key) => isTaskKey(key) && !todoIds.includes(taskIdFromKey(key)),
      );

      const applySet = () => {
        chrome.storage.sync.set(itemsToSet, () => {
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            console.error("failed to save to plain sync storage", lastError);
          } else {
            console.log("saved to plain sync storage");
          }
          if (typeof callback === "function") {
            callback({ lastError, failedTaskIds });
          }
        });
      };

      if (staleKeys.length > 0) {
        chrome.storage.sync.remove(staleKeys, applySet);
      } else {
        applySet();
      }
    });
  });
};

// to be called manually
// @ts-expect-error
window.sync = syncLocalStorage;
