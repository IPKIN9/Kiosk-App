<template>
  <BaseButton @click-event="getReport" class="fs-4 btn-primary"><span class="me-2"><i class="fa-solid fa-download"></i></span><span>Report</span></BaseButton>
  <BaseModal @click-event="showHideReport()" label="" sizing="modal-lg" modal-id="report-modal">
    <template v-slot:body>
      <div class="d-flex justify-content-center">
        <span class="fs-3" style="margin-top: -70px;">REPORT ORDER</span>
      </div>
      <div class="row mt-3 px-3">
        <div class="form-group">
          <label for="" class="form-label fs-5">Event</label>
          <div class="input-group input-group-merge">
            <span class="input-group-text"><i class="bx bx-search"></i></span>
            <input v-model="eventParams.search" @keyup="getEventList" type="text" class="form-control form-control-lg" placeholder="Search..." aria-label="Search...">
          </div>
          <select v-show="eventList.length >= 1" class="form-select mt-2" size="5">
            <option v-for="(event, index) in eventList" :key="index" class="fs-3 text-capitalize" :value="event.id" @click="setEventName({id: event.id, name: event.name})">{{ event.code }} | {{ event.name }}</option>
          </select>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
<script setup>
import BaseButton from '../Button/BaseButton.vue'
import Modal from 'bootstrap/js/dist/modal'
import BaseModal from '../BaseModal.vue'
import Other from '../../utils/Other'
import { reactive, onMounted, computed, ref } from 'vue'
import Event from '../../utils/Event'


const reportParams = reactive({
  event: 0,
  start: '',
  end: '',
  user: 0
})

const getReport = () => {
  showHideReport()

  let user = Other.getUserData()
  reportParams.user = user.id
}

const reportModal = ref(null)

const showHideReport = () => {
  reportModal.value.show() ? reportModal.value.show() : reportModal.value.hide()
}

const eventList = ref([])
const eventParams = reactive({
  limit: 10,
  page: 1,
  search: '',
  publish: true,
  merchant: localStorage.getItem('RENDERER_VITE_MERCHANT_ID'),
  total: 0
})

const getEventList = () => {
  if (eventParams.search.length >= 1) {
    Event.getList(eventParams)
    .then((res) => {
      const item = res.data
      eventList.value = item.data
    })
    .catch((err) => {
      console.log(err);
    })
  } else {
    eventList.value = []
  }
}

const setEventName = (params) => {
  eventList.value = []
  eventParams.search = params.name

  reportParams.event = params.id
  console.log(reportParams);
}

onMounted(() => {
  reportModal.value = new Modal('#report-modal', {
    keyboard: false
  })
})
</script>