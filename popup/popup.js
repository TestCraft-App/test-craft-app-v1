function enableButton(button) {
    button.classList.add('enabled');
    button.classList.remove('disabled');
}

function disableButton(button) {
    button.classList.add('disabled');
    button.classList.remove('enabled');
}

function disableLanguageOptionsForCypress() {
    javaBtn.classList.remove('available');
    csharpBtn.classList.remove('available');
    pythonBtn.classList.remove('available');
}

function enableLanguageOptions() {
    javaBtn.classList.add('available');
    csharpBtn.classList.add('available');
    pythonBtn.classList.add('available');
}

function pickOption(option) {
    switch (option) {
        case 'javascript':
            enableButton(javascriptBtn);
            disableButton(typescriptBtn);
            disableButton(javaBtn);
            disableButton(csharpBtn);
            disableButton(pythonBtn);
            break;

        case 'typescript':
            enableButton(typescriptBtn);
            disableButton(javascriptBtn);
            disableButton(javaBtn);
            disableButton(csharpBtn);
            disableButton(pythonBtn);
            break;

        case 'java':
            if (javaBtn.classList.contains('available')) {
                enableButton(javaBtn);
                disableButton(javascriptBtn);
                disableButton(typescriptBtn);
                disableButton(csharpBtn);
                disableButton(pythonBtn);
            }
            break;

        case 'csharp':
            if (csharpBtn.classList.contains('available')) {
                enableButton(csharpBtn);
                disableButton(javascriptBtn);
                disableButton(typescriptBtn);
                disableButton(javaBtn);
                disableButton(pythonBtn);
            }
            break;

        case 'python':
            if (pythonBtn.classList.contains('available')) {
                enableButton(pythonBtn);
                disableButton(javascriptBtn);
                disableButton(typescriptBtn);
                disableButton(javaBtn);
                disableButton(csharpBtn);
            }
            break;

        case 'cypress':
            enableButton(cypressBtn);
            disableButton(playwrightBtn);
            disableButton(seleniumBtn);
            disableLanguageOptionsForCypress();
            break;

        case 'playwright':
            enableButton(playwrightBtn);
            disableButton(cypressBtn);
            disableButton(seleniumBtn);
            enableLanguageOptions();
            break;

        case 'selenium':
            enableButton(seleniumBtn);
            disableButton(cypressBtn);
            disableButton(playwrightBtn);
            enableLanguageOptions();
            break;

        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const payload = { ping: true };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };
        fetch(`${OPENAI_PROXY_BASE_URL}${ENDPOINTS.GENERATE_TEST_IDEAS}`, options).then(() => {});

        const currentTabUrl = tabs[0].url;

        chrome.storage.local.get(
            [
                STORAGE.ELEMENT_PICKED,
                STORAGE.SITE_URL,
                STORAGE.LANGUAGE_SELECTED,
                STORAGE.FRAMEWORK_SELECTED,
                STORAGE.POM,
            ],
            (data) => {
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
                    pickOption(OPTION.PLAYWRIGHT);
                    chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: OPTION.PLAYWRIGHT });
                }

                if (data[STORAGE.LANGUAGE_SELECTED]) {
                    pickOption(data[STORAGE.LANGUAGE_SELECTED]);
                } else {
                    pickOption(OPTION.JAVASCRIPT);
                    chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.JAVASCRIPT });
                }

                chrome.storage.local.set({ [STORAGE.POM]: true });
            },
        );
    });
});

cypressBtn.addEventListener('click', () => {
    pickOption(OPTION.CYPRESS);
    chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: OPTION.CYPRESS });
});

playwrightBtn.addEventListener('click', () => {
    pickOption(OPTION.PLAYWRIGHT);
    chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: OPTION.PLAYWRIGHT });
});

seleniumBtn.addEventListener('click', () => {
    pickOption(OPTION.SELENIUM);
    chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: OPTION.SELENIUM });
});

javascriptBtn.addEventListener('click', () => {
    pickOption(OPTION.JAVASCRIPT);
    chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.JAVASCRIPT });
});

typescriptBtn.addEventListener('click', () => {
    pickOption(OPTION.TYPESCRIPT);
    chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.TYPESCRIPT });
});

javaBtn.addEventListener('click', () => {
    pickOption(OPTION.JAVA);
    chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.JAVA });
});

csharpBtn.addEventListener('click', () => {
    pickOption(OPTION.CSHARP);
    chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.CSHARP });
});

pythonBtn.addEventListener('click', () => {
    pickOption(OPTION.PYTHON);
    chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: OPTION.PYTHON });
});

// Update message and enable picker
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.source === 'stream' && request.status == 'finished') {
        pickerBtn.disabled = false;
        statusDescription.textContent = MESSAGES.SUCCESS;
    } else if (request.source === 'stream' && request.status == 'error') {
        pickerBtn.disabled = false;
        statusDescription.textContent = MESSAGES.FAILED;
    }
});
