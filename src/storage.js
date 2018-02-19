const STORAGE_KEY = "simpleTaskManagerData"

export const saveState = state => {
    chrome.storage.local.set({[STORAGE_KEY] : state}, () => {
        const lastError = chrome.runtime.lastError
        if (lastError) {
            console.log('error', lastError)
        } else {
            console.log('saved', state)
        }
    })
}

export const loadState = callback => {
    if (typeof callback !== 'function') {
        console.error('Callback given to loadState is not a function.', callback)
        return
    }
    chrome.storage.local.get(STORAGE_KEY, items => {
        callback(items[STORAGE_KEY])
    })
}