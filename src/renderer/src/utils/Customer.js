import Api from "./Main";
import AuthCheck from "./AuthCheck";

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/customer/";

export default {
  getList(name) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).get(
      `${endPoint}name/list?name=${name}`, AuthCheck.tokenConfig()
    );
  },
};
