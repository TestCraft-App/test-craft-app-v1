document.addEventListener('DOMContentLoaded', async () => {
    const data = await chrome.storage.local.get([STORAGE.CUSTOM_SERVER_URL]);
    const customServerUrl = data[STORAGE.CUSTOM_SERVER_URL];
    const BASE_URL = !!customServerUrl ? customServerUrl : OPENAI_PROXY_BASE_URL;

    async function isContentScriptLoaded() {
        try {
            const queryOptions = { active: true, currentWindow: true };
            const tabs = await chrome.tabs.query(queryOptions);

            if (!tabs || tabs.length === 0) {
                console.error('No active tab found');
                return false;
            }

            return new Promise((resolve) => {
                try {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'ping' }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('Error sending ping:', chrome.runtime.lastError);
                            resolve(false);
                        } else if (response && response.status === 'ready') {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                } catch (error) {
                    console.error('Error sending ping:', error);
                    resolve(false);
                }
            });
        } catch (error) {
            console.error('Error checking content script:', error);
            return false;
        }
    }

    const contentScriptLoaded = await isContentScriptLoaded();
    if (!contentScriptLoaded) {
        statusDescription.textContent = 'Warning: Content script may not be loaded. Try refreshing the page.';
    }

    //TODO: try catch
    fetch(`${BASE_URL}${ENDPOINTS.PING}`).then((res) => {
        if (res.status !== 200) {
            statusDescription.textContent = MESSAGES.FAILED;
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabUrl = tabs[0].url;
        chrome.storage.local.get([STORAGE.ELEMENT_PICKED, STORAGE.SITE_URL, STORAGE.ELEMENT_SCREENSHOT], (data) => {
            if (!data[STORAGE.SITE_URL] || data[STORAGE.SITE_URL] !== currentTabUrl) {
                chrome.storage.local.remove(
                    [STORAGE.ELEMENT_PICKED, STORAGE.ELEMENT_SOURCE, STORAGE.ELEMENT_SCREENSHOT],
                    () => {
                        chrome.storage.local.set({ [STORAGE.SITE_URL]: currentTabUrl }, () => {
                            screenShotImage.src = './../images/screenshot-placeholder.jpg';
                        });
                        automateBtn.disabled = true;
                        generateTestIdeasBtn.disabled = true;
                        checkAccessibilityBtn.disabled = true;
                    },
                );
            }

            if (data[STORAGE.ELEMENT_PICKED]) {
                automateBtn.disabled = false;
                generateTestIdeasBtn.disabled = false;
                checkAccessibilityBtn.disabled = false;
            } else {
                automateBtn.disabled = true;
                generateTestIdeasBtn.disabled = true;
                checkAccessibilityBtn.disabled = true;
            }

            if (data[STORAGE.ELEMENT_SCREENSHOT]) {
                debugger;
                screenShotImage.src = data[STORAGE.ELEMENT_SCREENSHOT];
            }
        });
    });

    pickerBtn.addEventListener('click', async () => {
        const contentScriptLoaded = await isContentScriptLoaded();
        if (!contentScriptLoaded) {
            statusDescription.textContent = 'Error: Content script not ready. Please refresh the page and try again.';
            return;
        }

        const queryOptions = { active: true, currentWindow: true };
        const tabs = await chrome.tabs.query(queryOptions);
        try {
            await chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.START_PICKING });
            window.close();
        } catch (error) {
            console.error('Error sending message:', error);
            statusDescription.textContent = 'Error: Content script not ready. Please refresh the page and try again.';
        }
    });

    pickerBtn.addEventListener('mouseenter', async () => {
        const contentScriptLoaded = await isContentScriptLoaded();
        if (!contentScriptLoaded) {
            return; // Silently fail for hover events
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            try {
                chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.HIGHLIGHT_ELEMENT });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });
    });

    pickerBtn.addEventListener('mouseleave', async () => {
        const contentScriptLoaded = await isContentScriptLoaded();
        if (!contentScriptLoaded) {
            return; // Silently fail for hover events
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            try {
                chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.UNHIGHLIGHT_ELEMENT });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });
    });
});

// Update message and enable picker
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.source === 'stream' && request.status == 'finished') {
        pickerBtn.disabled = false;
        automateBtn.disabled = false;
        generateTestIdeasBtn.disabled = false;
        checkAccessibilityBtn.disabled = false;
        statusDescription.textContent = MESSAGES.SUCCESS;
    } else if (request.source === 'stream' && request.status == 'error') {
        pickerBtn.disabled = false;
        if (!!request.message) {
            statusDescription.textContent = MESSAGES[request.message];
        } else {
            statusDescription.textContent = MESSAGES.FAILED;
        }
    }
});
