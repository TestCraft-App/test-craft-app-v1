document.addEventListener('DOMContentLoaded', function () {
    const languageContainer = document.getElementById('programming-language');
    const frameworkContainer = document.getElementById('framework');
    const mainContent = document.getElementById('main-content');
    const settingsButton = document.getElementById('settings-button');
    const settingsContent = document.getElementById('settings-content');
    const settingsImage = document.getElementById('settings-image');

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
        console.log(languages);
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
        [STORAGE.LANGUAGE_SELECTED, STORAGE.FRAMEWORK_SELECTED, STORAGE.POM],
        (data) => {
            console.log(data[STORAGE.FRAMEWORK_SELECTED]);
            let framework = data[STORAGE.FRAMEWORK_SELECTED]
                ? data[STORAGE.FRAMEWORK_SELECTED]
                : FRAMEWORK.PLAYWRIGHT;
            markOptionSelected(framework, 'framework');
            updateLanguageOptions(framework);

            let language = data[STORAGE.LANGUAGE_SELECTED]
                ? data[STORAGE.LANGUAGE_SELECTED]
                : LANGUAGE.JAVASCRIPT.id;
            console.log(language);
            markOptionSelected(language, 'language');
        },
    );
});
