import Api from "./Main";
import AuthCheck from "./AuthCheck";

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/event";

export default {
  getList(opt) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).get(
      `${endPoint}?limit=${opt.limit}&page=${opt.page}&merchant=${opt.merchant}&search=${opt.search}&publish=${opt.publish}`, AuthCheck.tokenConfig()
    );
  },
};
