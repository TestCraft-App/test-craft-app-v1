let createTestsButton;
let testIdeasTestsContainer;
let ideas;

document.addEventListener('DOMContentLoaded', () => {
    testIdeasTestsContainer = document.getElementById('testIdeas');
    createTestsButton = document.getElementById('createTests');
    const copyButton = document.getElementById('copyButton');

    copyButton.addEventListener('click', async () => {
        try {
            const selectedIdeas = createTestsButton.disabled ? testIdeasTestsContainer.textContent : getCheckedIdeas().join('\n');
            await navigator.clipboard.writeText(selectedIdeas);
            showToast(RESULT.SUCCESS, MESSAGES.COPIED);
        } catch (err) {
            showToast(RESULT.ERROR, MESSAGES.FAILED);
        }
    });

    createTestsButton.addEventListener('click', async () => {
        try {
            await chrome.storage.local.set({ [STORAGE.IDEAS]: getCheckedIdeas() });
            displayResultInNewWindow(chrome.runtime.getURL('pages/generatedTestsFromIdeas.html'))
        } catch (err) {
            showToast(RESULT.ERROR, MESSAGES.FAILED);
        }
    });

    showResult(FEATURE.GENERATE_TEST_IDEAS);
});

function finishIdeas() {
    ideas = document.querySelectorAll('label input');
    testIdeasTestsContainer.addEventListener('click', (event) => {
        if (event.target.matches('label input')) {
            let hasIdeasChecked = false;
            for (const idea of ideas) {
                if (idea.checked) {
                    hasIdeasChecked = true;
                    break;
                }
            }
            createTestsButton.disabled = !hasIdeasChecked;
        }
    });
}

function getCheckedIdeas(){
    const checkedIdeas = [];
    for (const idea of ideas) {
        if (idea.checked) {
            checkedIdeas.push(idea.parentElement.textContent.trim());
        }
    }
    return checkedIdeas;
}
