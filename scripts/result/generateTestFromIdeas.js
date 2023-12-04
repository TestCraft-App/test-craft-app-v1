document.addEventListener('DOMContentLoaded', async () => {
    hljs.configure({ ignoreUnescapedHTML: true });

    const codeBlock = document.getElementById('generatedTests');
    const copyButton = document.getElementById('copyButton');

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(codeBlock.textContent);
            showToast(RESULT.SUCCESS, MESSAGES.COPIED);
        } catch (err) {
            showToast(RESULT.ERROR, MESSAGES.FAILED);
        }
    });

    showResult(FEATURE.AUTOMATE_IDEAS);
});
