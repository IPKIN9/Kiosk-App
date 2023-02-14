import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap'
import '@popperjs/core/dist/cjs/popper'

const app = createApp(App)

app.use(router)

app.mount('#app')
