import jwt_decode from 'jwt-decode'

const envSctructure = {
	production:'production',
	staging:'staging',
	development:'development',
	local:'local',
	prod:'production',
	stg:'staging',
	dev:'development',
	prd:'production',
	loc:'local'
}

export default {

	envTransform(env) {
    return envSctructure[env]
  },

	checkResponse(code, callback){
		if (code === 401 && callback) {
			localStorage.removeItem('user')
			callback()
			return 'Your token is expired please re-login'
		} else {
			return this.errorResponse(code)
		}
	},

	tokenConfig() {
    const userToken = localStorage.getItem("user")
    return {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  },

	getScope() {
    const token = localStorage.getItem("user")
    if (token) {
      const decoded = jwt_decode(token);
      return decoded.scope
    } else {
      return null
    }
  },

  isConfig(){
    return localStorage.getItem('IS_CONFIG')
  },

  getLocalSetup(envKey){
    if (this.envTransform(import.meta.env.VITE_APP_ENV) != 'local') {
      return localStorage.getItem(envKey)
    } else {
      return import.meta.env[envKey]
    }
  },

	errorResponse(code){
    let msg = ''
    switch (parseInt(code)) {
      case 400:
        msg = 'Bad Request. Check format and try again.'
        break;

      case 403:
        msg = 'Forbidden. You do not have the required permissions to access this resource.'
        break;

      case 404:
        msg = 'Not Found. The requested resource could not be found.'
        break;

      case 405:
        msg = 'Method Not Allowed. The requested method is not supported for this resource.'
        break;

      case 408:
        msg = 'Timeout. The server took too long to respond to your request.'
        break;

      case 500:
        msg = 'Server Error: There was a problem with the server. Please try again later.'
        break;
    
      default:
        msg = `Oops! Something went wrong. Check your connection`
        break;
    }
    return msg
  },

  defaultErrorResponse(){
    return 'Oops! Something went wrong. Check your connection'
  }
}