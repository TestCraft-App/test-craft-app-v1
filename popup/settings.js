document.addEventListener('DOMContentLoaded', async () => {
    const languageContainer = document.getElementById('programming-language');
    const frameworkContainer = document.getElementById('framework');
    const mainContent = document.getElementById('main-content');
    const settingsButton = document.getElementById('settings-button');
    const settingsContent = document.getElementById('settings-content');
    const settingsImage = document.getElementById('settings-image');
    const apiKeyInput = document.getElementById('openai-api-key');
    const serverUrlInput = document.getElementById('custom-server-url');
    const openaiModelSelect = document.getElementById('openai-models');
    const statusElement = document.getElementById('optional-settings-status');

    function markOptionSelected(id, type) {
        let ids;
        if (type === 'language') {
            ids = Object.values(LANGUAGE).map((lang) => lang.id);
        } else {
            ids = Object.values(FRAMEWORK);
        }

        ids.forEach(function (currID) {
            const button = document.getElementById(currID);
            if (currID === id) {
                button.classList.add('enabled');
                button.classList.remove('disabled');
            } else {
                button.classList.add('disabled');
                button.classList.remove('enabled');
            }
        });
    }

    function selectAndSaveLanguage(language) {
        chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: language });
        markOptionSelected(language, 'language');
    }

    async function getModels() {
        apiKeyInput.disabled = true;
        serverUrlInput.disabled = true;
        const storageData = await chrome.storage.local.get([STORAGE.CUSTOM_SERVER_URL, STORAGE.OPENAI_API_KEY]);
        const customServerUrl = storageData[STORAGE.CUSTOM_SERVER_URL];
        const apiKey = storageData[STORAGE.OPENAI_API_KEY];

        const BASE_URL = !!customServerUrl ? customServerUrl : OPENAI_PROXY_BASE_URL;

        try {
            const requestUrl = new URL(`${BASE_URL}${ENDPOINTS.MODELS}`);
            if (apiKey) {
                requestUrl.searchParams.append('open_ai_api_key', apiKey);
            }

            const response = await fetch(requestUrl);
            if (response.status === 200) {
                return response.json();
            } else {
                return { models: [] };
            }
        } catch (e) {
            return { models: [] };
        } finally {
            apiKeyInput.disabled = false;
            serverUrlInput.disabled = false;
        }
    }

    function updateLanguageOptions(framework) {
        /**
         * The mappping corresponds to the language order:
         * [JS, TS, Java, C#, Python]
         * 0 means disabled, 1 means enabled
         */
        const options = {
            [FRAMEWORK.CYPRESS]: [1, 1, 0, 0, 0],
            [FRAMEWORK.PLAYWRIGHT]: [1, 1, 1, 1, 1],
            [FRAMEWORK.SELENIUM]: [1, 1, 1, 1, 1],
        };
        const languages = Object.values(LANGUAGE).map((lang) => lang.id);
        const enabled = options[framework];

        for (let index = 0; index < languages.length; index++) {
            const languageButton = document.getElementById(languages[index]);
            if (enabled[index]) {
                languageButton.classList.add('available');
                languageButton.disabled = false;
            } else {
                languageButton.classList.remove('available');
                languageButton.classList.remove('enabled');
                languageButton.classList.add('disabled');
                languageButton.disabled = true;
            }
        }

        const buttons = document.querySelectorAll('#programming-language button');
        let enabledButtonId = '';

        for (const button of buttons) {
            if (button.classList.contains('enabled')) {
                enabledButtonId = button.id;
                break;
            }
        }

        if (
            framework === FRAMEWORK.CYPRESS &&
            enabledButtonId !== LANGUAGE.JAVASCRIPT.id &&
            enabledButtonId !== LANGUAGE.TYPESCRIPT.id
        ) {
            selectAndSaveLanguage(LANGUAGE.JAVASCRIPT.id);
        }
    }

    Object.values(FRAMEWORK).forEach(function (framework) {
        let button = document.createElement('button');
        button.classList.add('disabled');
        button.id = framework;
        button.textContent = framework;
        frameworkContainer.appendChild(button);

        document.getElementById(framework).addEventListener('click', function () {
            chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: this.id });
            markOptionSelected(this.id, 'framework');
            updateLanguageOptions(framework);
        });
    });

    Object.values(LANGUAGE).forEach(function (language) {
        let button = document.createElement('button');
        button.classList.add('disabled');
        button.classList.add('available');
        button.id = language.id;
        button.textContent = language.label;
        languageContainer.appendChild(button);

        document.getElementById(language.id).addEventListener('click', function () {
            selectAndSaveLanguage(this.id);
        });
    });

    const response = await getModels();
    const DEFAULT_OPENAI_MODEL = response.default_model;
    const MODEL_SELECTION_ENABLED = response.model_selection_enabled;
    response.models.forEach((model, key) => {
        openaiModelSelect[key] = new Option(model.label, model.id);
    });

    settingsButton.addEventListener('click', function () {
        if (settingsImage.src.includes('icons8-settings-100.png')) {
            settingsImage.src = '../images/icons8-back-100.png';
            mainContent.style.display = 'none';
            settingsContent.style.display = 'block';
        } else {
            settingsImage.src = '../images/icons8-settings-100.png';
            mainContent.style.display = 'block';
            settingsContent.style.display = 'none';
        }
    });

    chrome.storage.local.get(
        [
            STORAGE.LANGUAGE_SELECTED,
            STORAGE.FRAMEWORK_SELECTED,
            STORAGE.POM,
            STORAGE.CUSTOM_SERVER_URL,
            STORAGE.OPENAI_API_KEY,
            STORAGE.OPENAI_MODEL,
        ],
        (data) => {
            let framework = data[STORAGE.FRAMEWORK_SELECTED] ? data[STORAGE.FRAMEWORK_SELECTED] : FRAMEWORK.PLAYWRIGHT;
            chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: framework });
            markOptionSelected(framework, 'framework');
            updateLanguageOptions(framework);

            let language = data[STORAGE.LANGUAGE_SELECTED] ? data[STORAGE.LANGUAGE_SELECTED] : LANGUAGE.JAVASCRIPT.id;
            chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: language });
            markOptionSelected(language, 'language');

            if (!!data[STORAGE.OPENAI_MODEL]) {
                openaiModelSelect.value = data[STORAGE.OPENAI_MODEL];
            } else {
                openaiModelSelect.value = DEFAULT_OPENAI_MODEL;
            }

            if (!!data[STORAGE.OPENAI_API_KEY] || !!data[STORAGE.CUSTOM_SERVER_URL]) {
                apiKeyInput.value = data[STORAGE.OPENAI_API_KEY];
                serverUrlInput.value = data[STORAGE.CUSTOM_SERVER_URL];
                openaiModelSelect.value = data[STORAGE.OPENAI_MODEL];
                openaiModelSelect.disabled = false;
            }

            if (!data[STORAGE.OPENAI_API_KEY] && !data[STORAGE.CUSTOM_SERVER_URL] && !MODEL_SELECTION_ENABLED) {
                openaiModelSelect.value = DEFAULT_OPENAI_MODEL;
                openaiModelSelect.disabled = true;
            }
        },
    );

    apiKeyInput.addEventListener('change', async () => {
        statusElement.innerText = '';
        await chrome.storage.local.set({ [STORAGE.OPENAI_API_KEY]: apiKeyInput.value });
        const response = await getModels();
        if (response.models.length > 0 && !!apiKeyInput.value) {
            openaiModelSelect.disabled = false;
        } else if (!apiKeyInput.value) {
            if (!MODEL_SELECTION_ENABLED) {
                openaiModelSelect.disabled = true;
            }
        } else if (response.models.length === 0) {
            apiKeyInput.value = '';
            await chrome.storage.local.set({ [STORAGE.OPENAI_API_KEY]: apiKeyInput.value });
            statusElement.innerText = 'Invalid API Key';
            if (!MODEL_SELECTION_ENABLED) {
                openaiModelSelect.disabled = true;
            }
        }
        if (!!serverUrlInput.value && openaiModelSelect.disabled) {
            const response = await getModels();
            if (response.models.length > 0) {
                openaiModelSelect.disabled = false;
            }
        }
        if (openaiModelSelect.disabled) {
            openaiModelSelect.value = DEFAULT_OPENAI_MODEL;
            await chrome.storage.local.set({ [STORAGE.OPENAI_MODEL]: DEFAULT_OPENAI_MODEL });
        }
    });

    serverUrlInput.addEventListener('change', async () => {
        statusElement.innerText = '';
        const serverUrl = serverUrlInput.value.trim();
        const modifiedUrl = serverUrl.replace(/\/$/, '');
        serverUrlInput.value = modifiedUrl;
        await chrome.storage.local.set({ [STORAGE.CUSTOM_SERVER_URL]: serverUrlInput.value });
        const response = await getModels();
        if (response.models.length > 0 && !!serverUrlInput.value) {
            openaiModelSelect.disabled = false;
        } else if (!serverUrlInput.value) {
            if (!MODEL_SELECTION_ENABLED) {
                openaiModelSelect.disabled = true;
            }
        } else if (response.models.length === 0) {
            serverUrlInput.value = '';
            await chrome.storage.local.set({ [STORAGE.CUSTOM_SERVER_URL]: serverUrlInput.value });
            statusElement.innerText = 'Invalid Server';
            if (!MODEL_SELECTION_ENABLED) {
                openaiModelSelect.disabled = true;
            }
        }
        if (!!apiKeyInput.value && openaiModelSelect.disabled) {
            const response = await getModels();
            if (response.models.length > 0) {
                openaiModelSelect.disabled = false;
            }
        }
        if (openaiModelSelect.disabled) {
            openaiModelSelect.value = DEFAULT_OPENAI_MODEL;
            await chrome.storage.local.set({ [STORAGE.OPENAI_MODEL]: DEFAULT_OPENAI_MODEL });
        }
    });

    openaiModelSelect.addEventListener('change', function () {
        var selectedValue = this.options[this.selectedIndex].value;
        chrome.storage.local.set({ [STORAGE.OPENAI_MODEL]: selectedValue });
    });
});
