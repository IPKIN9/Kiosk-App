<template>
  <div class="d-flex align-middle">
    <button type="button" class="btn btn-danger px-4" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <i class="fs-5 fa-solid fa-power-off"></i>
    </button>
    <ul class="dropdown-menu" style="">
      <li>
        <a role="button" @click="logOut" class="dropdown-item">
          <span class="fs-4">Logout</span>
          <i class="ms-3 fs-4 fa-solid fa-right-from-bracket float-end" style="margin-top: 6px;"></i>
        </a>
      </li>
      <li>
        <hr class="dropdown-divider">
      </li>
      <li>
        <a role="button" @click="powerOff" class="dropdown-item">
          <span class="fs-4">Power Off</span>
          <i class="ms-3 fs-4 fa-solid fa-power-off float-end" style="margin-top: 6px;"></i>
        </a>
      </li>
    </ul>
    <div class="row ms-4">
      <span>
        {{ moment(currentTime).format('DD MMM, YYYY') }}
      </span>
      <span class="fs-3" style="margin-top: -5px;">
        {{ moment(currentTime).format('HH:mm:ss') }}
      </span>
    </div>
  </div>
</template>
<script setup>
import Sweetalert from '../../utils/Sweetalert'
import Invoke from '../../utils/Invoke'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import moment from 'moment'

const router = useRouter()

const currentTime = ref()
const getCurrentTime = () => {
  setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
}

const logOut = () => {
  Sweetalert.alertConfirm({
    title: 'Logging Out',
    confirmtext: 'Logout'
  })
  .then((res) => {
    if (res.isConfirmed) {
      localStorage.removeItem('user')
      router.replace('/auth/login')
    }
  })
}

const powerOff = () => {
  Sweetalert.alertConfirm({
    title: 'Shutting Down',
    confirmtext: 'Power Off'
  })
  .then((res) => {
    if (res.isConfirmed) {
      localStorage.removeItem('user')
      Invoke.shutdownFunction()
    }
  })
}

onMounted(() => {
  getCurrentTime()
})
</script>