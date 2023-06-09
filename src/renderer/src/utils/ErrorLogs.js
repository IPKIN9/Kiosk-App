export default{
  writeToLog(msg) {
    return window.api.writeToLog("writeToLog", msg)
  },
}