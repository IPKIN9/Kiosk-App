<template>
  <div class="container-sm" style="width: 35% !important;">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <!-- Register -->
        <div class="card">
          <div class="card-body">
            <div class="d-flex mb-2 mt-5 justify-content-between">
              <h4 class="">Welcome to KIOSK! 👋</h4>
              <span @click="goToSetting"><i class="fs-3 fa-solid fa-gear"></i></span>
            </div>
            <p>Please sign-in to your account</p>
            <div class="d-flex mb-4">
              <span v-if="loginError" class="mt-2 text-danger">Wrong username or password. please try again</span>
            </div>
            <form id="formAuthentication" class="mb-3" action="index.html" method="POST">
              <div class="mb-4">
                <label for="email" class="form-label">Email or Username</label>
                <input v-model="dataPayload.username" type="text" class="form-control" id="email" name="email-username"
                  placeholder="Enter your email or username" autofocus />
              </div>
              <div class="mb-4 form-password-toggle">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Password</label>
                </div>
                <div class="input-group input-group-merge">
                  <input v-model="dataPayload.password" :type="passType === true ? 'password' : 'text'" id="password"
                    class="form-control" name="password"
                    placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                    aria-describedby="password" />
                  <a role="button" @click="showPassword" class="input-group-text cursor-pointer"><i
                      class="bx bx-hide"></i></a>
                </div>
              </div>
              <div class="mb-3">
                <BaseButton @click-event="submitData" class="btn-primary d-grid w-100">Sign in</BaseButton>
              </div>
            </form>
          </div>
        </div>
        <!-- /Register -->
      </div>
    </div>
  </div>
</template>
<script setup>
import BaseButton from '../components/Button/BaseButton.vue'

import Auth from '../utils/Auth'
import { useRouter } from "vue-router"
import { onMounted, reactive, ref } from "vue"
import CryptoJS from 'crypto-js'
import jwt_decode from "jwt-decode"
import Sweetalert from '../utils/Sweetalert'
import AuthCheck from '../utils/AuthCheck'

const passType = ref(true)
const showPassword = () => {
  passType.value === true ? passType.value = false : passType.value = true
}

const loginError = ref(false)

const dataPayload = reactive({
  username: '',
  password: ''
})

const router = useRouter();

const fetchGrantToken = () => {
  Auth.getGrantToken()
    .then((res) => {
      let token = res.data.data.access_token
      let tokenEncrypt = CryptoJS.AES.encrypt(
        token,
        import.meta.env.RENDERER_VITE_ENCRYPT_KEY
      ).toString();
      localStorage.setItem("token", tokenEncrypt)
      if (dataPayload.username.length >= 1 || dataPayload.password.length >= 1) {
        fetchUserToken()
      }
    })
    .catch((err) => {
      if (err.response) {
				let msg = AuthCheck.errorResponse(err.response.status)
				Sweetalert.alertError(msg)
			} else {
				Sweetalert.alertError(AuthCheck.defaultErrorResponse())
			}
    })
}

const fetchUserToken = () => {
  let tokenEncrypt = localStorage.getItem("token")
  let tokenDecrypt = CryptoJS.AES.decrypt(
    tokenEncrypt,
    import.meta.env.RENDERER_VITE_ENCRYPT_KEY
  ).toString(CryptoJS.enc.Utf8)

  Auth.getUserToken(dataPayload, tokenDecrypt)
    .then((res) => {
      const token = res.data.data.token;
      const decoded = jwt_decode(token);
      const isAdmin = decoded.scope.some(
        (item) => item.name === "gate-ticketing-svc"
      );
      if (isAdmin) {
        localStorage.setItem("user", token)
        router.push("/");
      } else {
        Sweetalert.alertError('Username or password not valid')
      }
    })
    .catch((err) => {
      if (err.response) {
        let code = err.response.data.name
        if (code === 'UNAUTHORIZED_FAILURE') {
          fetchGrantToken()
        } else if(err.response.status == '401') {
          loginError.value = true
        } else {
          let msg = AuthCheck.errorResponse(err.response.status)
          Sweetalert.alertError(msg)
        }
			} else {
				Sweetalert.alertError(AuthCheck.defaultErrorResponse())
			}
    })
}

const submitData = () => {
  loginError.value = false
  const grantToken = localStorage.getItem("token")
  if (grantToken) {
    fetchUserToken()
  } else {
    fetchGrantToken()
  }
}

const goToSetting = () => {
  router.replace('/setting')
}

onMounted(() => {
  const userToken = localStorage.getItem("user")
  if (userToken) {
    router.push('/')
  }
})
</script>