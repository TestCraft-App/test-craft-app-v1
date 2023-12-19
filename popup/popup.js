document.addEventListener('DOMContentLoaded', () => {
    fetch(`${OPENAI_PROXY_BASE_URL}${ENDPOINTS.PING}`).then((res) => {
        if (res.status !== 200) {
            statusDescription.textContent = MESSAGES.FAILED;
            statusDescription.style.display = 'block';
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabUrl = tabs[0].url;

        chrome.storage.local.get([
            STORAGE.ELEMENT_PICKED,
            STORAGE.SITE_URL,
            STORAGE.ELEMENT_SCREENSHOT
        ], data => {

            if (!data[STORAGE.SITE_URL] || data[STORAGE.SITE_URL] !== currentTabUrl) {
                chrome.storage.local.remove([STORAGE.ELEMENT_PICKED, STORAGE.ELEMENT_SOURCE]);
                chrome.storage.local.set({ [STORAGE.SITE_URL]: currentTabUrl });
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

            if(data[STORAGE.ELEMENT_SCREENSHOT]) {
                debugger;
                screenShotImage.src = data[STORAGE.ELEMENT_SCREENSHOT];
                screenshotContainer.style.display = 'block';
            }
        });
    });

    pickerBtn.addEventListener('click', async () => {
        const queryOptions = { active: true, currentWindow: true };
        const tabs = await chrome.tabs.query(queryOptions);
        await chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.START_PICKING });
        window.close();
    });
    
    pickerBtn.addEventListener('mouseenter', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.HIGHLIGHT_ELEMENT });
        });
    });
    
    pickerBtn.addEventListener('mouseleave', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.UNHIGHLIGHT_ELEMENT });
        });
    });

});

// Update message and enable picker
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.source === "stream" && request.status == "finished") {
            pickerBtn.disabled = false;
            statusDescription.textContent = MESSAGES.SUCCESS;
        }
        else if (request.source === "stream" && request.status == "error") {
            pickerBtn.disabled = false;
            statusDescription.textContent = MESSAGES.FAILED;
        }
    }
);
