import AuthCheck from "./AuthCheck";
import Api from "./Main";

const endPoint = "/in/health";
export default {
  check(){
   return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).get(endPoint)
  }
}