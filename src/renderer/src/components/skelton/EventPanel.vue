<template>
  <a role="button" class="card bg-primary px-2 py-2" data-bs-toggle="offcanvas" href="#eventCanvas">
    <div class="d-flex">
      <div class="card btn-card bg-white rounded">
        <img :src="eventIcon" class="icon-img" alt="">
      </div>
      <div class="ms-3 mt-2">
        <span class="d-flex text-white fs-6 rm-padding">Event</span>
        <span class="d-flex text-white fs-3 fw-bold rm-padding">{{ eventData.name ? eventData.name : 'Event not selected' }}</span>
      </div>
    </div>
  </a>

  <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="eventCanvas"
    aria-labelledby="eventCanvasLabel">
    <div class="offcanvas-header">
      <h4 class="offcanvas-title fw-bold" id="offcanvasWithBothOptionsLabel">EVENT LIST</h4>
      <BaseButton class="btn-icon btn-cs-close" data-bs-dismiss="offcanvas" aria-label="Close">
        <i class="fs-1 fa-solid fa-xmark"></i>
      </BaseButton>
    </div>
    <div class="offcanvas-body">
      <div class="d-flex">
        <h5 class="card-title text-primary flex-grow-1">{{ eventData.name ? eventData.name : 'No selected event' }}</h5>
      </div>

      <div class="input-group input-group-merge">
        <span class="input-group-text" id="basic-addon-search31"><i class="fs-4 bx bx-search"></i></span>
          <input type="text" class="form-control form-control-lg" placeholder="Search..." aria-label="Search..." v-model="meta.search" @keyup="getEvent()" />
        <span v-if="meta.search.length >= 5" @click.stop="clearSearch"
          class="text-muted input-group-text cursor-pointer"><i class="bx bx-trash fs-5"></i></span>
        <span v-if="loading" class="input-group-text">
          <div class="spinner-border spinner-border-sm text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </span>
      </div>
      <div class="list-group mt-3">
        <a v-for="(event, index) in payloadList" :key="index" role="button"
          @click.stop="sendEventData({ id: event.id, name: event.name })"
          class="list-group-item list-group-item-action d-flex py-3"
          :class="eventData.id === event.id ? 'active' : ''"><span class="col-lg-2">{{ event.code }}</span> <span
            class="col-lg-10">| {{ event.name }}</span></a>
      </div>
      <div v-if="payloadList.length < 1" class="card text-center">
        <div class="card-body">
          <h5 class="card-title">Data not found</h5>
        </div>
      </div>
    </div>
    <div class="offcanvas-footer">
      <Paggination :config="meta" @click-event="paginate" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import Event from '../../utils/Event'
import BaseButton from '../Button/BaseButton.vue'
import Paggination from '../Paggination.vue'
import AuthCheck from '../../utils/AuthCheck'
import Sweetalert from '../../utils/Sweetalert'
import eventIcon from '../../assets/img/event.png'

const emits = defineEmits(['clickEvent'])

const sendEventData = (params) => {
  emits('clickEvent', params)
  eventData.id = params.id
  eventData.name = params.name
}

// Get config
// #########################################################

const payloadList = ref([])
const meta = reactive({
  limit: 10,
  page: 1,
  search: '',
  publish: true,
  merchant: localStorage.getItem('VITE_MERCHANT_ID'),
  total: 0
})

const loading = ref(false)

const eventData = reactive({
  id: 0,
  name: ''
})

const getEvent = () => {
  loading.value = true
  Event.getList(meta)
    .then((res) => {
      let item = res.data
      payloadList.value = item.data
      let metaData = item.meta
      meta.total = metaData.total
      loading.value = false
    })
    .catch((err) => {
      if (err.response) {
        let code = err.response.status
        Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
      } else {
        Sweetalert.alertError(AuthCheck.defaultErrorResponse())
      }
      loading.value = false
    })
}

const clearSearch = () => {
  meta.search = ''
  getEvent()
}

const paginate = (params) => {
  meta.page = params
  getEvent()
}

const router = useRouter()

const goToLogin = () => {
    router.push("/auth/login")
  }

onBeforeMount(() => {
  let appEnv = import.meta.env.VITE_APP_ENVIRONMENT
  if (AuthCheck.envTransform(appEnv) != 'local') {
    const userToken = localStorage.getItem("user")
    if (!userToken) {
      goToLogin()
    }
  }
})

onMounted(() => {
  getEvent()
  sendEventData({ id: 0, name: '' })
})
</script>