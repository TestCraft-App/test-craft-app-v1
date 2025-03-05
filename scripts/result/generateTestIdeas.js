let createTestsButton;
let testIdeasTestsContainer;
let ideas;

document.addEventListener('DOMContentLoaded', () => {
    testIdeasTestsContainer = document.getElementById('testIdeas');
    createTestsButton = document.getElementById('createTests');
    const copyButton = document.getElementById('copyButton');

    copyButton.addEventListener('click', async () => {
        try {
            const selectedIdeas = createTestsButton.disabled
                ? testIdeasTestsContainer.textContent
                : getCheckedIdeas().join('\n');
            await navigator.clipboard.writeText(selectedIdeas);
            showToast(RESULT.SUCCESS, MESSAGES.COPIED);
        } catch (err) {
            showToast(RESULT.ERROR, MESSAGES.FAILED);
        }
    });

    createTestsButton.addEventListener('click', async () => {
        try {
            await chrome.storage.local.set({ [STORAGE.IDEAS]: getCheckedIdeas() });
            displayResultInNewWindow(chrome.runtime.getURL('pages/generatedTestsFromIdeas.html'));
        } catch (err) {
            showToast(RESULT.ERROR, MESSAGES.FAILED);
        }
    });

    showResult(FEATURE.GENERATE_TEST_IDEAS);
});

function finishIdeas() {
    testIdeasTestsContainer.addEventListener('click', (event) => {
        if (event.target.matches('label input')) {
            ideas = document.querySelectorAll('label input');
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

    const editButtons = document.querySelectorAll('button.edit-btn');
    editButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const btn = event.currentTarget;
            const label = btn.parentNode;

            const span = label.querySelector('span.test-idea-text');
            const input = label.querySelector('span.test-idea-text input');

            if (input.type === 'checkbox') {
                btn.disabled = true;
                var textNode = [...span.childNodes].filter((node) => {
                    return node.nodeType == Node.TEXT_NODE;
                })[0];

                if (textNode) {
                    const ideaText = textNode.textContent;
                    label.removeChild(span);

                    const newSpan = document.createElement('span');
                    newSpan.classList.add('test-idea-text');

                    const inputText = document.createElement('input');
                    inputText.type = 'text';
                    inputText.value = ideaText;
                    inputText.classList.add('editing-idea');

                    newSpan.appendChild(inputText);
                    label.insertBefore(newSpan, label.querySelector('button.edit-btn'));

                    inputText.addEventListener('blur', () => {
                        const newText = inputText.value;
                        label.removeChild(label.querySelector('span'));

                        const newSpan = document.createElement('span');
                        newSpan.classList.add('test-idea-text');

                        const checkBox = document.createElement('input');
                        checkBox.type = 'checkbox';
                        checkBox.setAttribute('name', 'idea');

                        const textNode = document.createTextNode(newText);

                        newSpan.appendChild(checkBox);
                        newSpan.appendChild(textNode);

                        label.insertBefore(newSpan, label.querySelector('button.edit-btn'));
                        input.classList.remove('editing-idea');

                        setTimeout(function() {
                            btn.disabled = false;
                        }, 300);
                    });

                    inputText.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter' || event.key === 'Escape') {
                            inputText.blur();
                        }
                    });

                    inputText.focus();
                }
            }
        });
    });
}

function getCheckedIdeas() {
    const checkedIdeas = [];
    for (const idea of ideas) {
        if (idea.checked) {
            checkedIdeas.push(idea.parentElement.textContent.trim());
        }
    }
    return checkedIdeas;
}
