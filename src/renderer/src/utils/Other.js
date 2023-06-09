import jwt_decode from 'jwt-decode'

export default {
  getNumberOnly(string){
    return string.split("-")[1]
  },

  getUserData(user){
    let token = ''
    if (user) {
      token = user
    } else {
      token = localStorage.getItem('user');
    }
		const decoded = jwt_decode(token);
    return decoded
  },
  
  splitName(nama){
    if (nama.length <= 18) {
      return nama;
    } else {
      return nama.substring(0, 19) + "...";
    }
  }
}