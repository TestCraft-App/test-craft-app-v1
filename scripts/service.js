function cropImage(dataUrl, x, y, width, height, callback) {
    fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
            return createImageBitmap(blob);
        })
        .then((imageBitmap) => {
            const maxWidth = imageBitmap.width - x;
            const maxHeight = imageBitmap.height - y;

            const cropWidth = Math.min(width, maxWidth);
            const cropHeight = Math.min(height, maxHeight);

            const offscreenCanvas = new OffscreenCanvas(cropWidth, cropHeight);
            const ctx = offscreenCanvas.getContext('2d');

            const sx = Math.max(0, x);
            const sy = Math.max(0, y);

            ctx.drawImage(imageBitmap, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            ctx.strokeStyle = '#545454';
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

            return offscreenCanvas.convertToBlob();
        })
        .then((blob) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64data = reader.result;
                callback(base64data);
            };
            reader.readAsDataURL(blob);
        })
        .catch((error) => {
            console.error('Error processing the image:', error);
        });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'element-picked') {
        chrome.storage.local.set({
            ['selected-element']: request.source,
            ['element-picked']: true,
        });
    } else if (request.action === 'captureElement') {
        const { x, y, width, height } = request.details;
        chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' }, function (dataUrl) {
            cropImage(dataUrl, x, y, width, height, (croppedDataUrl) => {
                chrome.storage.local.set({ ['element-screenshot']: croppedDataUrl });
            });
        });
        return true;
    }
});
