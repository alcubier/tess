const {dialog, clipboard, nativeImage} = require('electron');
const fs = require('original-fs');
const path = require('path');


let imagePath = "";

const clipboardButton = document.getElementById('clipboard-image-button');
const browseButton = document.getElementById('browse-image-button');

clipboardButton?.addEventListener('click', () => {
    // get image from clipboard
    const image = getImageFromClipboard();
    if (image) {
        // write image to file
        writeClipboardImageToFile(image);
        console.log('Image written to file');
    }
    else {
        console.log('No image in clipboard');
    }
});




browseButton?.addEventListener('click', () => {
    //set imagePath from file browser
    imagePath = getImagePathFromFileBrowser();
    console.log('Image path: ' + imagePath);
});


function getImagePathFromFileBrowser() {
    const filePath = dialog.showOpenDialogSync({
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }
        ]
    });
    return filePath === undefined ? "" : filePath[0];
}


function getImageFromClipboard() {
    return clipboard.readImage();
}


function writeClipboardImageToFile(image: Electron.NativeImage) {
    const filePath = path.join(__dirname + '/clipboard.png');
    fs.writeFile(filePath, image.toPNG(), (err: any) => {
        if (err) {
            console.error(err);
        }
    });
}

