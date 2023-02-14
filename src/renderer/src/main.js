import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap'
import '@popperjs/core/dist/cjs/popper'

import './assets/vendor/fonts/boxicons.css'
import './assets/vendor/css/core.css'
import './assets/vendor/css/theme-default.css'
import './assets/css/demo.css'
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css'
import './assets/vendor/js/helpers'
import './assets/js/config'
import './assets/vendor/js/menu'

const app = createApp(App)

app.use(router)

app.mount('#app')
