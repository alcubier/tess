const {ipcRenderer} = require('electron');
const fs = require('original-fs');
const path = require('path');



const clipboardButton = document.getElementById('clipboard-image-button');
const browseButton = document.getElementById('browse-image-button');

clipboardButton?.addEventListener('click', () => {
    ipcRenderer.send('get-clipboard-image');
});


browseButton?.addEventListener('click', () => {
    ipcRenderer.send('get-image-path');
});

