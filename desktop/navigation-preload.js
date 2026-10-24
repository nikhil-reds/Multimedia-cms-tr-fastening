const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('playerNavigation', {
  back: () => ipcRenderer.send('navigation:back'),
  onState: (callback) => ipcRenderer.on('navigation:state', (_event, state) => callback(state)),
})

