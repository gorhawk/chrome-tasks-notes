import { largeSync } from "../lib/largeSync";

largeSync && console.debug("largeSync module loaded");

const STORAGE_KEY = "tasks_notes_tab";
const STORAGE_KEY_OLD_LARGESYNC = "simpleTaskManagerData";

const QUOTA = chrome.storage.sync.QUOTA_BYTES_PER_ITEM;
const QUOTA_MARGIN = 8;

function saveString(key: string, data: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(key.concat(data));
  if (bytes.length + QUOTA_MARGIN > QUOTA) {
  }
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
      if (!data || Object.keys(data).length === 0) {
        console.debug(
          "initial data from sync is empty, trying local storage",
          data,
        );
        chrome.storage.local.get(STORAGE_KEY, (items) => {
          console.debug("unconditional load from local storage", data);
          callback(items[STORAGE_KEY]);
        });
      } else {
        callback(data[STORAGE_KEY]);
      }
    });
  } catch (error) {
    console.error("failed loading data from either sync storage", e);
    callback(undefined);
  }
};

export const syncLocalStorage = (callback?: Function) => {
  chrome.storage.local.get(null, (items) => {
    console.log("saving FROM local storage", items);
    chrome.storage.sync.set(items, () => {
      console.log("saved to plain sync storage");
    });
  });
};

// to be called manually
window.sync = syncLocalStorage;
