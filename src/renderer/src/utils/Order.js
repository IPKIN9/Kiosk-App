import Api from "./Main";
import AuthCheck from './AuthCheck'

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL;
const endPoint = "/ex/v1/order";

export default {
  getList(opt) {
    return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).get(
      `${endPoint}?limit=${opt.limit}&page=${opt.page}&search=${opt.search}&checkout=${opt.checkout}&status=${opt.status}&paid=${opt.paid}`, AuthCheck.tokenConfig()
    );
  },
  upsert(payload) {
    return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).post(endPoint, payload, AuthCheck.tokenConfig())
  },
  pay(payload){
    return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).post(`${endPoint}/progress`, payload, AuthCheck.tokenConfig())
  },
  validate(id){
    return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).get(`${endPoint}/validate/${id}`, AuthCheck.tokenConfig())
  },
  detail(id) {
    return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).get(`${endPoint}/${id}`, AuthCheck.tokenConfig())
  },
  cancelOrder(id){
    return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).get(`${endPoint}/cancel/${id}`, AuthCheck.tokenConfig())
  }
};
