document.addEventListener('DOMContentLoaded', () => {
    const accessibilityCheckContainer = document.getElementById('accessibility-check');
    const copyButton = document.getElementById('copyButton');

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(accessibilityCheckContainer.textContent);
            showToast(RESULT.SUCCESS, MESSAGES.COPIED);
        } catch (err) {
            showToast(RESULT.ERROR, MESSAGES.FAILED);
        }
    });

    showResult(FEATURE.CHECK_ACCESSIBILITY);
});
