chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'element-picked') {
        chrome.storage.local.set({ ['selected-element']: request.source, ['element-picked']: true });
    }
});
