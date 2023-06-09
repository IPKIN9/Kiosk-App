import Api from "./Main";
import AuthCheck from "./AuthCheck";

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/report/kiosk";

export default {
  getList(params) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).get(
      `${endPoint}?event=${params.event}&start=${params.start}&end=${params.end}&user=${params.user}`, AuthCheck.tokenConfig()
    );
  },
};
