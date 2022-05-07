import { app, BrowserWindow, clipboard, dialog} from "electron";
import * as fs from "original-fs";
import * as path from 'path';
import {ipcMain} from "electron";

app.on('ready', () => {
    console.log('App is ready');

    const win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const indexHTML = path.join(__dirname + '/index.html');
    win.loadFile(indexHTML).then(() => {
            
    }).catch(e => console.error(e));
});

const pathLocation = __dirname;
let imagePath = "";

// --- IPC Events ---

ipcMain.on('get-clipboard-image', (event) => {
    const image = clipboard.readImage();
    if (image) {
        // write image to file
        writeClipboardImageToFile(image);
        console.log('Image written to file');
        //update target image file path
        imagePath = path.join(pathLocation + '/clipboard.png');
    }
    else {
        console.log('No image in clipboard');
    }
});


ipcMain.on('get-image-path', (event) => {
    getImagePathFromFileBrowser();
});

// --- Get Image Functions ---

function getImagePathFromFileBrowser() {
    const options = {
        title: 'Select image',
        properties: ['openFile'],
        filters: [
            {name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif']}
        ]
    }

    dialog.showOpenDialog(<Electron.OpenDialogSyncOptions>options)
    .then((result: any) => {
        console.log(result);
        if (result.canceled) {
            console.log('Canceled');
        }
        else {
            imagePath = result.filePaths[0];
            console.log(imagePath);
        }
    })
    .catch((err: any) => {
        console.log(err);
    });
}


function writeClipboardImageToFile(image: Electron.NativeImage) {
    const filePath = path.join(pathLocation + '/clipboard.png');
    // write file
    fs.writeFile(filePath, image.toPNG(), (err: any) => {
        if (err) {
            console.error(err);
        }
    });
}



