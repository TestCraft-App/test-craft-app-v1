pickerBtn.addEventListener('click', async () => {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    await chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.START_PICKING });
    window.close();
});

pickerBtn.addEventListener('mouseenter', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.HIGHLIGHT_ELEMENT });
    });
});

pickerBtn.addEventListener('mouseleave', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.UNHIGHLIGHT_ELEMENT });
    });
});