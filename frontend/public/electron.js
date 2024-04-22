const { app, BrowserWindow, dialog, contextBridge } = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
const path = require('path');
const url = require('url');
const { exec, spawn } = require('child_process');
const net = require('net');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const virtualEnvPath = app.isPackaged ? path.join(app.getPath('exe'), '..', 'backend', 'venv') : path.join(__dirname, '..', '..', 'backend', 'venv');
let nexusBackendPort;

// Find a free port for the Flask server
function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close();
      resolve(port);
    });
  });
}

let win;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true
  })

  const appURL = app.isPackaged
  ? url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }) : 'http://localhost:3000';

  win.loadURL(appURL)
}

// Start the backend server
function startBackend(port=5000) {
  // Set the environment variable for the Flask server
  process.env.NEXUS_BACKEND_PORT = port;

  // Start the backend Flask server
  // Get path to electron built executable
  const electronPath = app.getPath('exe');
  const backendPath = app.isPackaged ? path.join(electronPath, '..', 'backend', 'app.py') : path.join(__dirname, '..', '..', 'backend', 'app.py');
  const pythonPath = path.join(virtualEnvPath, 'Scripts', 'python');
  const backendProcess = spawn(pythonPath, [backendPath]);

  // Print the output of the backend server
  backendProcess.stdout.setEncoding('utf-8');
  backendProcess.stdout.on('data', (data) => {
    console.log(`[Flask] ${data}`);
  });
  backendProcess.stderr.setEncoding('utf-8');
  backendProcess.stderr.on('data', (data) => {
    console.error(`[Flask] ${data}`);
  });
  backendProcess.on('close', (code) => {
    console.log(`[Flask] Exited with code ${code}`);
  });
}

// Check if Python is installed
function checkPython() {
  return new Promise((resolve, reject) => {
    exec('python --version', (error, stdout, stderr) => {
      if (error) {
        console.error('Python is not installed.');
        resolve(false)
      } else {
        resolve(true)
      }
    });
  });
}

// Wait until you're able to ping the server
function waitForBackend(port) {
  return new Promise((resolve, reject) => {
    const axios = require('axios');
    const pingServer = async () => {
      try {
        await axios.get(`http://localhost:${port}/ping`);
        console.log("Creating Flask server")
      } catch (error) {
        console.error(error);
        setTimeout(pingServer, 1000);
      }

      resolve();
    };
    pingServer();
  });
}

// Create a virtual environment
function createVirtualEnv(virtualEnvPath='venv') {
  console.log('Creating virtual environment');
  return new Promise((resolve, reject) => {
    exec(`python -m venv ${virtualEnvPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating virtual environment: ${error}`);
        reject();
      } else {
        console.log('Virtual environment created');

        // Install the required packages
        const requirementsPath = path.join(virtualEnvPath, '..', 'requirements.txt')
        console.log("Installing requirements into virtual environment");
        exec(`${path.join(virtualEnvPath, 'Scripts', 'pip')} install -r ${requirementsPath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error installing requirements: ${error}`);
            reject();
          } else {
            console.log('Requirements installed');
            resolve();
          }
        });
      }
    });
  });
}

// Check for a virtual Python environment
function checkVirtualEnv(virtualEnvPath='venv') {
  // Check if the virtual environment exists
  return new Promise((resolve, reject) => {
    exec(`ls ${virtualEnvPath}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`Virtual environment not found: ${virtualEnvPath}`);
        createVirtualEnv(virtualEnvPath).then(() => {
          resolve();
        });
      } else {
        console.log(`Virtual environment found: ${virtualEnvPath}`);
        resolve();
      }
    });
  });
}

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(() => {
  checkPython().then((pythonInstalled) => {
    if (pythonInstalled) {
      checkVirtualEnv(virtualEnvPath).then(() => {
        getFreePort().then((port) => {
          // Save the port so that the BrowserWindow can access it
          nexusBackendPort = port
          console.log(`Backend port: ${port}`);
          startBackend(port);
          waitForBackend(port).then(createWindow);
        });
      });
    } else {
      dialog.showMessageBox({
        type: 'error',
        title: 'Python Not Found',
        message: 'Python is required to run this application. Please install Python and restart the application.',
        buttons: ['OK']
      }).then(() => {
        app.quit();
      });
    }
  });
})