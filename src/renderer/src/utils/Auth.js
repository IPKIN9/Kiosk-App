import AuthCheck from './AuthCheck'
import API from './Main'

// const authUrl = import.meta.env.VITE_GATE_AUTH_URL

export default {
  getGrantToken () {
    return API(AuthCheck.getLocalSetup('VITE_GATE_AUTH_URL')).post('ex/v1/grant/client', {
      api_key:import.meta.env.VITE_OAUTH_API_KEY,
      api_secret:import.meta.env.VITE_OAUTH_API_SECRET,
      expired_at: 1440
    })
  },
  getUserToken (data, token) {
    return API(AuthCheck.getLocalSetup('VITE_GATE_AUTH_URL')).post('ex/v1/grant/user/password', data , {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  }
}