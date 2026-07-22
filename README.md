# Chrome Tasks And Notes Tab

Simple, synced todo management in a separate tab.

[Visit in the Chrome Web Store](https://chrome.google.com/webstore/detail/hnpkfibfpjnliookebflfogcgmihcbkc)

## Extension info

This will **not** replace your new tab. The reason for this is the permission for replacing the new tab is not optional, so users cannot turn it off, but you can always set your homepage manually to this extension.

**No third party cloud storage.**
It stores all of the data in your Chrome's sync storage. This is tied to your Google account, and you can sync it across your browsers that use your Google account (eg. Chrome, Chromium) but nothing else.

#### Limits

Chrome's sync storage is small by design (see [chrome.storage docs](https://developer.chrome.com/docs/extensions/reference/api/storage)), so this extension has a couple of built-in limits:

- **Task text length**: each task is synced as its own item, capped at ~8KB. The editor warns you once you're close to that limit.
- **Number of tasks**: up to ~300 tasks total across all lists. This is lower than Chrome's 512-item ceiling because every task's ID also has to fit, alongside your lists, inside a single ~8KB index record. The app warns you once you hit the limit.

If a task's text is still too long to sync once you hit "save", it stays safely on this device (in local storage, which has a much bigger 10MB limit) but is skipped when syncing to your other devices until you shorten it.

#### Planned features:

- notes
- some hotkeys
- undo/redo
- multiple task lists
- unicode icon/emoji selector
- storage usage indicator/settings (sync storage is very limited)
