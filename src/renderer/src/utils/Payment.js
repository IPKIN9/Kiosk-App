import Api from "./Main";
import AuthCheck from "./AuthCheck";

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/payment/method";

export default {
  getList(opt) {
    return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).get(
      `${endPoint}?limit=${opt.limit}&page=${opt.page}`, AuthCheck.tokenConfig()
    );
  },
};
