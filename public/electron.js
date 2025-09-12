const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true
    }
  });

  // Carga el build de React
  win.loadFile(path.join(__dirname, '../build/index.html'));

  // Abre DevTools para depurar
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
