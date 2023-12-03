document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.getElementById('back-button');
    const mainContent = document.getElementById('main-content');
    const settingsContent = document.getElementById('settings-content');
    const languageSelect = document.getElementById('language-select');
    const frameworkSelect = document.getElementById('framework-select');
    const pomSelect = document.getElementById('pom-select');
    const settingsButton = document.getElementById('settings');

    Object.values(LANGUAGE).forEach(function (language) {
        var option = document.createElement('option');
        option.value = language.toLowerCase();
        option.textContent = language;
        languageSelect.appendChild(option);
    });

    function updateFrameworkOptions(language) {
        frameworkSelect.innerHTML = '';

        var options = {
            [LANGUAGE.CSHARP]: [FRAMEWORK.SELENIUM, FRAMEWORK.PLAYWRIGHT],
            [LANGUAGE.JAVA]: [FRAMEWORK.SELENIUM, FRAMEWORK.PLAYWRIGHT],
            [LANGUAGE.JAVASCRIPT]: [FRAMEWORK.SELENIUM, FRAMEWORK.PLAYWRIGHT, FRAMEWORK.CYPRESS],
            [LANGUAGE.PYTHON]: [FRAMEWORK.SELENIUM, FRAMEWORK.PLAYWRIGHT],
            [LANGUAGE.TYPESCRIPT]: [FRAMEWORK.SELENIUM, FRAMEWORK.PLAYWRIGHT, FRAMEWORK.CYPRESS],
        };

        options[language].forEach(function (framework) {
            var option = document.createElement('option');
            option.value = framework.toLowerCase();
            option.textContent = framework;
            frameworkSelect.appendChild(option);
        });
    }

    settingsButton.addEventListener('click', function () {
        mainContent.style.display = 'none';
        settingsContent.style.display = 'block';
    });

    backButton.addEventListener('click', function () {
        settingsContent.style.display = 'none';
        mainContent.style.display = 'block';
    });

    languageSelect.addEventListener('change', function () {
        chrome.storage.local.set({ [STORAGE.LANGUAGE_SELECTED]: this.value })
        const selectedLanguageLabel = languageSelect.options[languageSelect.selectedIndex].text;
        updateFrameworkOptions(selectedLanguageLabel)
    });

    frameworkSelect.addEventListener('change', function () {
        chrome.storage.local.set({ [STORAGE.FRAMEWORK_SELECTED]: this.value })
    });

    pomSelect.addEventListener('change', function () {
        chrome.storage.local.set({ [STORAGE.POM]: this.value })
    });

    chrome.storage.local.get([
        STORAGE.LANGUAGE_SELECTED,
        STORAGE.FRAMEWORK_SELECTED,
        STORAGE.POM
    ], data => {

        if (data[STORAGE.LANGUAGE_SELECTED]) {
            languageSelect.value = data[STORAGE.LANGUAGE_SELECTED];
        } else {
            languageSelect.value = LANGUAGE.JAVASCRIPT
        }

        if (data[STORAGE.FRAMEWORK_SELECTED]) {
            frameworkSelect.value = data[STORAGE.FRAMEWORK_SELECTED]
        }

        if (data[STORAGE.POM]) {
            pomSelect.value = data[STORAGE.POM]
        }

        const selectedLanguageLabel = languageSelect.options[languageSelect.selectedIndex].text;
        updateFrameworkOptions(selectedLanguageLabel)
    });
});