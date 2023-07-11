import Api from "./Main";
import AuthCheck from "./AuthCheck";

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/approval_log";

export default {
  createApproval(payload) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).post(
      `${endPoint}`, payload, AuthCheck.tokenConfig()
    );
  },
};
