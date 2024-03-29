import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { exec } from 'child_process'
import path, { join } from 'path'
import fs from 'fs';
import moment from 'moment'

function forceQuit() {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    win.close()
  })
  app.quit()
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setFullScreen(true)
    mainWindow.setAlwaysOnTop(false)
    })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  globalShortcut.register('Shift+F1', () => {
    mainWindow.setAlwaysOnTop(false)
  })

  globalShortcut.register('F12', () => {
    // mainWindow.webContents.openDevTools()
  })

  globalShortcut.register('F11', () => {
  })
  
  globalShortcut.register('F5', () => {
    // mainWindow.webContents.reload()
  })
    
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    mainWindow.webContents.executeJavaScript(`
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    `)
    forceQuit()
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    win.close()
  })
  app.quit()
})

app.disableHardwareAcceleration()

let content = null

const printStruct = (arg, callBack) => {
  const dataString = JSON.stringify(arg)
  const encodedData = encodeURIComponent(dataString)
  let dirname = join(__dirname, '../../resources/invoice')
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.loadURL(`file://${dirname}/${arg.path_file}?data=${encodedData}`)
  win.webContents.openDevTools()
  content = win
}

ipcMain.handle('ready-print', (event, data) => {
  const options = {
    silent: true,
    margins: {
      marginType: 'none'
    },
    scaleFactor: 85,
    printBackground: false,
    deviceName: 'POS-80C'
  }

  content.webContents.print(options, (success, errorType) => {
    if (success) {
      content.close()
    } else {
      console.log(errorType)
    }
  })
})

ipcMain.handle('printStruct', async (event, arg) => {
  console.log('Received message from renderer:', arg)
  const sendFeedBack = () => {}

  printStruct(arg, sendFeedBack)
})

ipcMain.handle('shutdown', async (event) => {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    win.close()
  })

  exec('shutdown /s /t 0', (error) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    app.quit()
  })
})

ipcMain.handle('writeToLog', async (event, message) => {
  const logMessage = `${moment().format('DD/MM/YYYY HH:mm:ss')}: ${message}\n`;

  const logFileName = 'app.log';
  let logFolderPath;

  if (process.platform === 'win32') {
    logFolderPath = path.join(app.getPath('documents'), 'WoviLog');
  } else {
    logFolderPath = path.join(app.getPath('home'), 'Documents', 'WoviLog');
  }

  const logFilePath = path.join(logFolderPath, logFileName);

  // Memastikan direktori log ada sebelum menulis ke file
  if (!fs.existsSync(logFolderPath)) {
    fs.mkdirSync(logFolderPath, { recursive: true });
  }

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Gagal menulis ke file log:', err);
    }
  });
});
