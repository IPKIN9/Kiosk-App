import AuthCheck from './AuthCheck'
import CryptoJS from 'crypto-js'
import API from './Main'

// const authUrl = import.meta.env.VITE_GATE_AUTH_URL

export default {
  getGrantToken() {
    return API(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_AUTH_URL')).post('ex/v1/grant/client', {
      api_key: import.meta.env.RENDERER_VITE_OAUTH_API_KEY,
      api_secret: import.meta.env.RENDERER_VITE_OAUTH_API_SECRET,
      expired_at: 1440
    })
  },

  getUserToken(data, token) {
    return API(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_AUTH_URL')).post(
      'ex/v1/grant/user/password',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  },

  logout(username) {
    return API(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_USER_URL')).post(
      `/ex/v1/logout`,
      username,
      AuthCheck.tokenConfig()
    )
  },

  loginControl() {
    const merchantId = localStorage.getItem('RENDERER_VITE_MERCHANT_ID')
    let tokenEncrypt = localStorage.getItem('token')
    let tokenDecrypt = CryptoJS.AES.decrypt(
      tokenEncrypt,
      import.meta.env.RENDERER_VITE_ENCRYPT_KEY
    ).toString(CryptoJS.enc.Utf8)

    return API(AuthCheck.getLocalSetup('RENDERER_VITE_GATE_USER_URL')).get(
      `/ex/v1/user/count?merchant=${merchantId}&roles=staff`,
      {
        headers: {
          Authorization: `Bearer ${tokenDecrypt}`
        }
      }
    )
  }
}
