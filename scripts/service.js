chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'element-picked') {
        chrome.storage.local.set({ ['selected-element']: request.source, ['element-picked']: true });
        if (request.screenShot) {
            chrome.storage.local.set({ ['element-screenshot']: request.screenShot});
          }
    }
});
