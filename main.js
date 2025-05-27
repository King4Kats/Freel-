const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;
let timerWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 340,
    height: 600,
    minWidth: 100,
    minHeight: 50,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: true,
    resizable: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.platform === 'darwin') {
    win.setWindowButtonVisibility(false);
  }

  win.setMenu(null);
  win.loadFile(path.join(__dirname, 'index.html'));

  // Gestion de la fermeture de la fenêtre principale
  win.on('closed', () => {
    if (timerWindow) {
      timerWindow.close();
    }
  });
}

function createTimerWindow() {
  timerWindow = new BrowserWindow({
    width: 300,
    height: 400,
    minWidth: 100,
    minHeight: 50,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: true,
    resizable: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  timerWindow.loadFile(path.join(__dirname, 'timer.html'));

  // Gestion de la fermeture de la fenêtre du timer
  timerWindow.on('closed', () => {
    timerWindow = null;
  });
}

// Configuration du lancement automatique
function setupAutoLaunch() {
  const appPath = app.getPath('exe');
  app.setLoginItemSettings({
    openAtLogin: true,
    path: appPath,
    args: []
  });
}

app.whenReady().then(() => {
  createWindow();
  setupAutoLaunch();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Gestion de l'ouverture du timer
ipcMain.on('open-timer', () => {
  if (!timerWindow) {
    createTimerWindow();
  } else {
    timerWindow.focus();
  }
});

// Gestion de la fermeture de l'application
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
