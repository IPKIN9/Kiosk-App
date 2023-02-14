import Api from './Main.js'
import AuthCheck from './AuthCheck.js'

// const baseUrl = import.meta.env.VITE_GATE_SERVICE_URL
const endPoint = '/ex/v1/refund'

export default {
    getRefund (opt) {
        return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).get(`${endPoint}?limit=${opt.limit}&page=${opt.page}&status=${opt.status}&search=${opt.search}`, AuthCheck.tokenConfig())
    },

    upsertRefund (payload) {
        return Api(AuthCheck.getLocalSetup('VITE_GATE_SERVICE_URL')).post(endPoint, payload, AuthCheck.tokenConfig())
    },
}