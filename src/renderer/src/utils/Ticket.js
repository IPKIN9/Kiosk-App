import Api from "./Main";
import AuthCheck from "./AuthCheck";

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/event/ticket";

export default {
  getList(params) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).get(
      `${endPoint}?page=${params.page}&limit=${params.limit}&eventarea=${params.area.id}&status=&use=&search=`, AuthCheck.tokenConfig()
    );
  },
  reactiveTicket(payload) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).post('/ex/v1/ticket/reactivated', payload, AuthCheck.tokenConfig())
  }
};
