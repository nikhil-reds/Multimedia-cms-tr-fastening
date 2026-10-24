const { test } = require('node:test')
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const vm = require('node:vm')
const fs = require('node:fs')
const path = require('node:path')

test('web links open inside the player and only the navigation control can go back', async () => {
  const views = []
  class Contents extends EventEmitter {
    navigationHistory = { canGoBack: () => true, goBack: () => { this.wentBack = true }, clear: () => {} }
    setWindowOpenHandler(handler) { this.open = handler }
    loadURL(url) { this.url = url; return Promise.resolve() }
    loadFile() {}
    send(channel, state) { this.lastMessage = { channel, state } }
    focus() {}
    isDestroyed() { return false }
  }
  class View {
    webContents = new Contents()
    constructor() { views.push(this) }
    setBackgroundColor() {}
    setBounds(bounds) { this.bounds = bounds }
    setVisible() {}
  }
  class Window extends EventEmitter {
    contentView = { addChildView() {} }
    getContentBounds() { return { width: 1920, height: 1080 } }
  }
  const ipcMain = new EventEmitter()
  ipcMain.handle = () => {}
  const app = new EventEmitter()
  app.requestSingleInstanceLock = () => true
  app.whenReady = () => Promise.resolve()
  const electron = { app, BaseWindow: Window, WebContentsView: View, Menu: { setApplicationMenu() {} }, ipcMain }
  const context = vm.createContext({
    require: (name) => name === 'electron' ? electron : require(name),
    __dirname, process, console, setTimeout, clearTimeout, setInterval, clearInterval,
  })
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8'), context)
  await Promise.resolve()
  const [content, overlay, navigation] = views
  vm.runInContext('current = { serverUrl: "https://cms.example", screenId: "1" }', context)
  assert.equal(content.webContents.open({ url: 'https://example.com/linked-page' }).action, 'deny')
  assert.equal(content.webContents.url, 'https://example.com/linked-page')
  content.webContents.open({ url: 'file:///secret' })
  assert.equal(content.webContents.url, 'https://example.com/linked-page')
  content.webContents.emit('did-frame-navigate')
  assert.equal(navigation.webContents.lastMessage.state.canGoBack, true)
  ipcMain.emit('navigation:back', { sender: content.webContents })
  assert.equal(content.webContents.wentBack, undefined)
  ipcMain.emit('navigation:back', { sender: navigation.webContents })
  assert.equal(content.webContents.wentBack, true)
  assert.deepEqual({ ...navigation.bounds }, { x: 1808, y: 1024, width: 100, height: 44 })
  assert.equal(overlay.webContents.open({ url: 'https://example.com' }).action, 'deny')
})
