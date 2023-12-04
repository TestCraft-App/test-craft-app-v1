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
        updateFrameworkOptions(language);
        markOptionSelected(language, 'language');
    }

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

    Object.values(FRAMEWORK).forEach(function (framework) {
        let button = document.createElement('button');
        button.classList.add('disabled');
        button.id = framework;
        button.textContent = framework;
        frameworkContainer.appendChild(button);

        document.getElementById(framework).addEventListener('click', function () {
            chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: this.id });
            markOptionSelected(this.id, 'framework');
        });
    });

    function updateFrameworkOptions(language) {
        /**
         * The mappping corresponds to the framework order:
         * [cypress, playwright, selenium]
         * 0 means disabled, 1 means enabled
         */
        const options = {
            [LANGUAGE.CSHARP.id]: [0, 1, 1],
            [LANGUAGE.JAVA.id]: [0, 1, 1],
            [LANGUAGE.JAVASCRIPT.id]: [1, 1, 1],
            [LANGUAGE.PYTHON.id]: [0, 1, 1],
            [LANGUAGE.TYPESCRIPT.id]: [1, 1, 1],
        };
        const frameworks = Object.values(FRAMEWORK);
        const enabled = options[language];

        for (let index = 0; index < frameworks.length; index++) {
            const fmwButt = document.getElementById(frameworks[index]);
            if (enabled[index]) {
                fmwButt.classList.add('available');
                fmwButt.disabled = false;
            } else {
                fmwButt.classList.remove('available');
                fmwButt.classList.remove('enabled');
                fmwButt.classList.add('disabled');
                fmwButt.disabled = true;
            }
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
            console.log(data[STORAGE.LANGUAGE_SELECTED]);
            let language = data[STORAGE.LANGUAGE_SELECTED]
                ? data[STORAGE.LANGUAGE_SELECTED]
                : LANGUAGE.JAVASCRIPT.id;
            markOptionSelected(language, 'language');
            updateFrameworkOptions(language);

            let framework = data[STORAGE.FRAMEWORK_SELECTED]
                ? data[STORAGE.FRAMEWORK_SELECTED]
                : FRAMEWORK.SELENIUM;
            markOptionSelected(framework, 'framework');
        },
    );
});
