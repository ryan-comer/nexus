const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
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

// Set the environment variable for the Flask port
process.env.BOT_HUB_PORT = 5000;

// Start the backend Flask server
const { spawn } = require('child_process');
// Get path to electron built executable
const electronPath = app.getPath('exe');
const backendPath = app.isPackaged ? path.join(electronPath, '..', 'backend', 'app.py') : path.join(__dirname, '..', '..', 'backend', 'app.py');
const backendProcess = spawn('python', [backendPath]);

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

// Wait until you're able to ping the server
const axios = require('axios');
const pingServer = async () => {
  try {
    await axios.get('http://localhost:5000/ping');
    console.log("Creating Flask server")
    app.whenReady().then(createWindow);
  } catch (error) {
    console.error(error);
    setTimeout(pingServer, 1000);
  }
};
pingServer();

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