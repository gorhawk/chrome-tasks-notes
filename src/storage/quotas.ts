// Chrome Manifest V3 storage quotas.
// Reference: https://developer.chrome.com/docs/extensions/reference/api/storage

// Max size (in bytes) of one synced item: JSON stringification of the value plus the key length.
// This is the only sync constant that actually gates behavior below (see storage.ts's stageString).
export const SYNC_QUOTA_BYTES_PER_ITEM = chrome.storage.sync.QUOTA_BYTES_PER_ITEM; // 8192 B

// Total bytes allowed across all synced items combined. Reference only -- not enforced here,
// since sharding by task already keeps individual items well within budget.
export const SYNC_QUOTA_BYTES = chrome.storage.sync.QUOTA_BYTES; // 102400 B

// Max number of keys allowed in sync storage.
export const SYNC_MAX_ITEMS = chrome.storage.sync.MAX_ITEMS; // 512

// Write-rate limits (set/remove/clear calls). Reference only -- not enforced here.
export const SYNC_MAX_WRITE_OPS_PER_MINUTE =
  chrome.storage.sync.MAX_WRITE_OPERATIONS_PER_MINUTE; // 120
export const SYNC_MAX_WRITE_OPS_PER_HOUR =
  chrome.storage.sync.MAX_WRITE_OPERATIONS_PER_HOUR; // 1800

// chrome.storage.local has no per-item cap, just this total (10 MB; 5 MB pre-Chrome 113). Reference only.
export const LOCAL_QUOTA_BYTES = chrome.storage.local.QUOTA_BYTES;

// Fast, cheap warning threshold for live typing: plain string length, ~90% of the real per-item
// cap. Not byte-accurate (doesn't account for multi-byte characters or JSON/key overhead) --
// good enough for an early warning while the user is still typing.
export const TASK_TEXT_WARNING_LENGTH = Math.floor(
  SYNC_QUOTA_BYTES_PER_ITEM * 0.9,
);

// Max number of tasks we'll let the user create. Every task id also lives in the index item's
// `todoIds` array (see storage.ts), so the real binding constraint is that array fitting inside
// SYNC_QUOTA_BYTES_PER_ITEM alongside todoLists/activeListId -- not SYNC_MAX_ITEMS, which is far
// looser. Assumes ~16-byte JSON-encoded id (14-char id + quotes) and reserves 40% of the item for
// todoLists/activeListId/JSON overhead/safety margin.
const ASSUMED_ID_JSON_LENGTH = 16;
export const MAX_TASK_COUNT = Math.floor(
  (SYNC_QUOTA_BYTES_PER_ITEM * 0.6) / ASSUMED_ID_JSON_LENGTH,
); // ~307
