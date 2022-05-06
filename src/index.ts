//language: typescript

import { app, BrowserWindow, clipboard } from "electron";
import * as fs from "original-fs";

import * as path from 'path';

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




