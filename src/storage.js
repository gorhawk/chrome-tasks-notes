import largeSync from './../node_modules/chrome-storage-largesync/dist/chrome-Storage-largeSync'

const STORAGE_KEY = "simpleTaskManagerData"

export const saveState = state => {
    chrome.storage.local.set({[STORAGE_KEY] : state}, () => {
        const lastError = chrome.runtime.lastError
        if (lastError) {
            console.error(lastError)
        } else {
            console.debug('saved locally', state)
        }
    })
}

export const loadState = callback => {
    if (typeof callback !== 'function') {
        console.error('Callback given to loadState is not a function.', callback)
        return
    }
    chrome.storage.largeSync.get(null, (data) => {
        console.log("retrieved from sync with LS", data)
        if (!data || Object.keys(data).length === 0) {
            chrome.storage.local.get(STORAGE_KEY, items => {
                callback(items[STORAGE_KEY])
            })
        } else {
            callback(data[STORAGE_KEY])
        }
    })
}

export const syncLocalStorage = callback => {
    chrome.storage.local.get(null, items => {
        console.log("saving FROM local storage", items)
        chrome.storage.largeSync.set(items, () => {
            console.log("saved to sync with LS")
        })
    })
}

window.sync = syncLocalStorage;