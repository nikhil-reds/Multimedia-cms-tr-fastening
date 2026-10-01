const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('player', {
  submit: (payload) => ipcRenderer.invoke('overlay:submit', payload),
  cancel: () => ipcRenderer.send('overlay:cancel'),
  onShow: (callback) => ipcRenderer.on('overlay:show', (_event, state) => callback(state)),
})
