import Api from "./Main";
import AuthCheck from "./AuthCheck";

const userURL = "/ex/v1/login/password";

export default {
  withPassword(payload, token){
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_USER_URL')).post(userURL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  }
}