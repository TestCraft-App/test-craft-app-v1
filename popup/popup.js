function enableButton(button) {
    button.classList.add('enabled');
    button.classList.remove('disabled');
};

function disableButton(button) {
    button.classList.add('disabled');
    button.classList.remove('enabled');
};

function pickOption(option) {
    let enable, disable;

    switch (option) {
        case 'javascript':
            enable = javascriptBtn;
            disable = typescriptBtn;
            break;

        case 'typescript':
            enable = typescriptBtn;
            disable = javascriptBtn;
            break;

        case 'cypress':
            enable = cypressBtn;
            disable = playwrightBtn;
            break;

        case 'playwright':
            enable = playwrightBtn;
            disable = cypressBtn;
            break;

        case 'pom-on':
            enable = pomOnBtn;
            disable = pomOffBtn;
            break;

        case 'pom-off':
            enable = pomOffBtn;
            disable = pomOnBtn;
            break;

        default:
            break;
    }

    enableButton(enable);
    disableButton(disable);
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const payload = { ping: true };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        fetch(`${OPENAI_PROXY_BASE_URL}${ENDPOINTS.GENERATE_TEST_IDEAS}`, options).then(() => { });

        const currentTabUrl = tabs[0].url;

        chrome.storage.local.get([
            STORAGE.ELEMENT_PICKED,
            STORAGE.SITE_URL,
            STORAGE.LANGUAGE_SELECTED,
            STORAGE.FRAMEWORK_SELECTED,
            STORAGE.POM
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

            if (data[STORAGE.FRAMEWORK_SELECTED]) {
                pickOption(data[STORAGE.FRAMEWORK_SELECTED]);
            } else {
                pickOption(OPTION.CYPRESS);
                chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: OPTION.CYPRESS });
            }

            if (data[STORAGE.LANGUAGE_SELECTED]) {
                pickOption(data[STORAGE.LANGUAGE_SELECTED]);
            } else {
                pickOption(OPTION.JAVASCRIPT);
                chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.JAVASCRIPT });
            }

            if (data[STORAGE.POM]) {
                pickOption('pom-on');
            } else {
                pickOption('pom-off');
                chrome.storage.local.set({ [STORAGE.POM]: false });
            }
        });
    });
});

cypressBtn.addEventListener('click', () => {
    pickOption(OPTION.CYPRESS)
    chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: OPTION.CYPRESS });
});

playwrightBtn.addEventListener('click', () => {
    pickOption(OPTION.PLAYWRIGHT);
    chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: OPTION.PLAYWRIGHT });
});

javascriptBtn.addEventListener('click', () => {
    pickOption(OPTION.JAVASCRIPT);
    chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.JAVASCRIPT });
});

typescriptBtn.addEventListener('click', () => {
    pickOption(OPTION.TYPESCRIPT)
    chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.TYPESCRIPT });
});

pomOnBtn.addEventListener('click', () => {
    pickOption('pom-on')
    chrome.storage.local.set({ [STORAGE.POM]: true });
});

pomOffBtn.addEventListener('click', () => {
    pickOption('pom-off')
    chrome.storage.local.set({ [STORAGE.POM]: false });
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
