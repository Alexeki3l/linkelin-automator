// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { BrowserWindow, contextBridge, ipcRenderer } = require("node:electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openLinkedIn: (userId: string) => ipcRenderer.send("openLinkedIn", userId),
});
