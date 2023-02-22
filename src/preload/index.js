import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  invoke: (channel, data) => {
		return ipcRenderer.invoke(channel, data); 
	},
  ping: () => ipcRenderer.invoke('ping'),
  flushLocalStorage: () => ipcRenderer.invoke('flushLocalStorage')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
}
