import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'izitoast/dist/css/iziToast.css'
const app = createApp(App)

app.use(router)

app.mount('#app')

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap'
import '@popperjs/core/dist/cjs/popper'

import './assets/css/mainmenu.css'
import './assets/css/all.css'
import './assets/vendor/fonts/boxicons.css'
import './assets/vendor/css/core.css'
import './assets/vendor/css/theme-default.css'
import './assets/css/demo.css'
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css'
import './assets/js/all'
import './assets/vendor/js/helpers'
import './assets/js/config'
import './assets/vendor/js/menu'
