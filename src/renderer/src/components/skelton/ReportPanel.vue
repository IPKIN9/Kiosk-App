<template>
  <BaseButton @click-event="getReport" class="fs-4 btn-primary"><span class="me-2"><i class="fa-solid fa-file-lines"></i></span><span>Report</span></BaseButton>
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
          <span v-for="error in vReport$.search.$errors" :key="error.$uid">
            <small class="text-danger text-lowercase">{{ error.$message }}</small>
          </span>
        </div>
        <div class="form-group mt-3">
          <label for="" class="form-label fs-5">Start Date</label>
          <VueDatePicker format="dd/MM/yy, HH:mm" v-model="reportParams.start" placeholder="Select date..." utc :clearable="false"></VueDatePicker>
        </div> 
        <div class="form-group mt-3">
          <label for="" class="form-label fs-5">End Date</label>
          <VueDatePicker format="dd/MM/yy, HH:mm" v-model="reportParams.end" placeholder="Select date..."
          :min-date="minDate" utc :clearable="false"></VueDatePicker>
        </div>
      </div>
      <div class="d-flex py-4 mt-3 px-3">
        <BaseButton class="btn-primary fs-5 me-4" @click-event="sendReport"><i class="fa-solid fa-print me-2"></i>Print Report</BaseButton>
        <BaseButton class="btn-danger fs-5" @click-event="showHideReport()" type-button="close">Cancel</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
<script setup>
import { reactive, onMounted, computed, ref, watch } from 'vue'
import { required, helpers } from '@vuelidate/validators'
import VueDatePicker from '@vuepic/vue-datepicker';
import BaseButton from '../Button/BaseButton.vue'
import { useVuelidate } from '@vuelidate/core'
import '@vuepic/vue-datepicker/dist/main.css'
import Currency from '../../utils/Currency'
import Modal from 'bootstrap/js/dist/modal'
import BaseModal from '../BaseModal.vue'
import Invoke from '../../utils/Invoke'
import Report from '../../utils/Report'
import Other from '../../utils/Other'
import Event from '../../utils/Event'
import moment from 'moment'
import Sweetalert from '../../utils/Sweetalert';
import ErrorLogs from '../../utils/ErrorLogs';


const reportParams = reactive({
  event: 0,
  start: new Date().toISOString(),
  end: new Date().toISOString(),
  user: 0
})

const getReport = () => {
  showHideReport()

  let user = Other.getUserData()
  reportParams.user = user.id
}

const minDate = ref(null)

const calculateDate = () => {
  if (reportParams.start.length >= 1) {
    minDate.value = reportParams.start
  } else {
    minDate.value = null
  }
}

watch(reportParams, (newReport) => {
  if (reportParams.start) {
    calculateDate()
  }
})

const reportModal = ref(null)

const showHideReport = (params) => {
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
      if (err.response) {
        ErrorLogs.writeToLog(`${err.response.status} | GetEventList on ReportPanel.vue - ${err.response.data.message}`)
      } else {
        ErrorLogs.writeToLog(err.message)
      }
    })
  } else {
    eventList.value = []
  }
}

const setEventName = (params) => {
  eventList.value = []
  eventParams.search = params.name

  reportParams.event = params.id
}

const reportRules = computed(() => {
  return {
    search: { required }
  }
})

const vReport$ = useVuelidate(reportRules, eventParams)

const sendReport = async () => {
  const validate = await vReport$.value.$validate()
  if (validate) {
    Report.getList(reportParams)
    .then((res) => {
      let item = res.data

      const structData = {
        path_file: 'report.html',
        detail: []
      }

      if (item.data.length >= 1) {
        for (const key in item.data) {
        structData.detail.push({
          unit: localStorage.getItem('RENDERER_VITE_KIOSK_LABEL'),
          event_name: item.data[key].event_name,
          username: item.data[key].username,
          event_date: moment(item.data[key].event_date).format('DD MMM, YYYY | HH:mm'),
          total_price: `Rp. ${Currency.rupiahValue(parseInt(item.data[key].total_price))}`,
          total_price_receive: `Rp. ${Currency.rupiahValue(parseInt(item.data[key].total_price_receive))}`,
          total_refund: item.data[key].total_refund ? `Rp. ${Currency.rupiahValue(parseInt(item.data[key].total_refund))}` : 'no refund',
          print_date: moment(item.data[key].created_at).format('DD MMM, YYYY | HH:mm')
        })
      }

      printReport(structData)
      } else {
        showHideReport()
        Sweetalert.alertSuccess('Success but report is empty')
        clearReport()
      }
    })
    .catch((err) => {
      if (err.response) {
        ErrorLogs.writeToLog(`${err.response.status} | SendReport on ReportPanel.vue - ${err.response.data.message}`)
      } else {
        ErrorLogs.writeToLog(err.message)
      }
      showHideReport()
      clearReport()
    })
  }
}

const printReport = (data) => {
  console.log(data);
  Invoke.printFunction(data)
  .then((res) => {
    showHideReport()
    clearReport()
  })
}

const clearReport = () => {
  vReport$.value.$reset()
  reportParams.start = new Date().toISOString()
  reportParams.end = new Date().toISOString()
  eventParams.search = ''
  eventList.value = []
  reportParams.event = 0
}

onMounted(() => {
  reportModal.value = new Modal('#report-modal', {
    keyboard: false
  })
})
</script>