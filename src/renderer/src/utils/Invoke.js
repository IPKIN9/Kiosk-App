export default {
  printFunction(data) {
    return window.api.invoke("printStruct", data)
  },
  shutdownFunction() {
    return window.api.invoke("shutdown", null)
  },
  ping(){
    return window.api.ping()
  }
};
