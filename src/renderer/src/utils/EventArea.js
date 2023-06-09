import Api from "./Main";
import AuthCheck from "./AuthCheck";

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/event/area";

export default {
  getList(id) {
    return Api(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_SERVICE_URL')).get(
      `${endPoint}/list/${id}`, AuthCheck.tokenConfig()
    );
  },
};
