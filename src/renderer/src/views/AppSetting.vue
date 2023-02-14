<template>
  <div class="d-flex justify-content-between">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">General Settings /</span> Environment</h4>
    <div>
      <BaseButton @click-event="backToDashboard" class="btn-danger fs-4"><i class="fa-solid fa-circle-arrow-left me-2"></i>BACK</BaseButton>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-6">
      <div class="mb-3">
        <BaseInput v-model="deviceIppAddress.RENDERER_VITE_MERCHANT_ID" label="Merchant ID" class="form-control-lg" placeholder="1"/>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="mb-3">
        <BaseInput v-model="deviceIppAddress.RENDERER_VITE_KIOSK_LABEL" label="Kiosk Device Label" class="form-control-lg" placeholder="Kiosk 001"/>
      </div>
    </div>
  </div>
  <div class="row mt-2">
    <div class="col-lg-6">
      <div class="mb-3">
        <BaseInput v-model="deviceIppAddress.RENDERER_VITE_KIOSK_URL" label="Kiosk Device Address" class="form-control-lg" placeholder="http://127.0.0.1:3000"/>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="mb-3">
        <BaseInput v-model="deviceIppAddress.RENDERER_VITE_GATE_SERVICE_URL" label="Gate Service Url" class="form-control-lg" placeholder="http://127.0.0.1:3000"/>
      </div>
    </div>
  </div>
  <div class="row mt-2">
    <div class="col-lg-6">
      <div class="mb-3">
        <BaseInput v-model="deviceIppAddress.RENDERER_VITE_GATE_AUTH_URL" label="Kiosk Auth Url" class="form-control-lg" placeholder="http://127.0.0.1:3000"/>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="mb-3">
        <BaseInput v-model="deviceIppAddress.RENDERER_VITE_GOOGLE_CLOUD_STORAGE_URL" label="Google Cloud Service Url" class="form-control-lg" placeholder="http://127.0.0.1:3000"/>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-9"></div>
    <BaseButton @click-event="saveNewEnvironment" class="btn-primary btn-lg mt-4 fs-2 col-lg-3"> <i class="fa-solid fa-floppy-disk fs-4 me-2"></i>Save Change</BaseButton>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import BaseButton from '../components/Button/BaseButton.vue';
import BaseInput from '../components/input/BaseInput.vue';
import AuthCheck from "../utils/AuthCheck"
import Sweetalert from '../utils/Sweetalert';

const deviceIppAddress = reactive({
  RENDERER_VITE_KIOSK_LABEL: '',
  RENDERER_VITE_KIOSK_URL: '',
  RENDERER_VITE_GATE_SERVICE_URL: '',
  RENDERER_VITE_GATE_AUTH_URL: '',
  RENDERER_VITE_GOOGLE_CLOUD_STORAGE_URL: '',
  RENDERER_VITE_MERCHANT_ID: ''
})

const showEnvironment = () => {
  if (AuthCheck.isConfig() == 'true') {
    for (const key in deviceIppAddress) {
      deviceIppAddress[key] = localStorage.getItem(key)
    }
  } else {
  const env = import.meta.env
    for (const key in deviceIppAddress) {
      deviceIppAddress[key] = env[key]
    }
  }
}

const router = useRouter()

const saveNewEnvironment = () => {
  localStorage.setItem('IS_CONFIG', true)

  for (const key in deviceIppAddress) {
    localStorage.setItem(key, deviceIppAddress[key])
  }

  Sweetalert.alertSuccess('Setup Compleate')
  .then((res) => {
    if (res.isConfirmed) {
      router.replace('/')
    }
  })
}

const backToDashboard = () => {
  router.replace('/')
}

onMounted(() => {
  showEnvironment()
})
</script>