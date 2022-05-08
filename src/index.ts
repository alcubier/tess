import { app, BrowserWindow, clipboard, dialog} from "electron";
import * as fs from "original-fs";
import * as path from 'path';
import {ipcMain} from "electron";
import { exec } from 'child_process';

const pathLocation = __dirname;
const tesseractPath = "\"C:/Program Files/Tesseract-OCR/tesseract.exe\"";
let imagePath = '';

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
                
        ipcMain.on('get-clipboard-image', (event) => {
            const image = clipboard.readImage();
            if (image) {
                // write image to file
                writeClipboardImageToFile(image);
                console.log('Image written to file');
                //update target image file path
                imagePath = path.join(pathLocation + '/clipboard.png');
                sendOutputToWindow(win);
            }
            else {
                console.log('No image in clipboard');
            }
        });


        ipcMain.on('get-image-path', (event) => {
            getImagePathFromFileBrowser();
            sendOutputToWindow(win);
        });   
    }).catch(e => console.error(e));
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


async function runOCR(callback?: (outputText: string|null) => void) {
    //execute command
    const command = tesseractPath + ' ' + imagePath + ' -'; // output to stdout 
    console.log(command);
    await exec(command, (err: any, stdout: any, stderr: any) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(stdout);
            if (callback) { callback(stdout); }
        }
    });
    
}


function sendOutputToWindow(window: BrowserWindow) {
    runOCR((output) => {
        console.log(output);
        if (output) {
            window.webContents.send('ocr-text', output);
        }
        else {
            window.webContents.send('ocr-text', 'No text found');
        }
    });
}
