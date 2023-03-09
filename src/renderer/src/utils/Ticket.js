import Api from "./Main";
import AuthCheck from "./AuthCheck";

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/event/ticket";

export default {
  getList(params) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).get(
      `${endPoint}?page=${params.page}&limit=${params.limit}&eventarea=${params.eventarea}&status=&use=&search=${params.search}`, AuthCheck.tokenConfig()
    );
  },
  reactivated(payload) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL').post(
      `${endPoint}/reactivated`, payload,AuthCheck.tokenConfig())
    )
  }
};
