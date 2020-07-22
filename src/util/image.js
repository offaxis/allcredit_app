
export function dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for(let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}

export function getImageFromCamera(previewWrapperId, canvasId) {
    if(document) {
        const preview = document.getElementById(previewWrapperId) && document.getElementById(previewWrapperId).getElementsByTagName('video')[0];
        const canvas = document.getElementById(canvasId);
        if(preview && canvas) {
            const maxWidth = 1000;
            const ratio = preview.videoWidth < maxWidth ? Math.round(maxWidth / preview.videoWidth * 100) / 100 : 1;
            const destWidth = maxWidth;
            const destHeight = preview.videoHeight * ratio;
            canvas.height = destHeight;
            const context = canvas.getContext('2d');
            context.drawImage(preview, 0, 0, preview.videoWidth, preview.videoHeight, 0, 0, destWidth, destHeight);
            return canvas.toDataURL('image/jpeg');
        }
    }
}
