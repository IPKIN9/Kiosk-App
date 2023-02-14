export default {
  printFunction(data, type) {
    return window.api.invoke("printStruct", data)
  },
  shutdownFunction() {
    return window.api.invoke("shutdown", null)
  }
};
