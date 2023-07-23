let newTabId;

function displayResultInNewWindow(resultsUrl) {
    const windowWidth = 800;
    const windowHeight = 600;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const left = (screenWidth / 2) - (windowWidth / 2);
    const top = (screenHeight / 2) - (windowHeight / 2);
    chrome.windows.create({
        url: resultsUrl,
        type: 'popup',
        width: windowWidth,
        height: windowHeight,
        left: Math.round(left),
        top: Math.round(top)
    }, function (window) {
        newTabId = window.tabs[0].id;
    });
}