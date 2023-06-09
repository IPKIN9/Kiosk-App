<template>
  <div class="container-fluid mt-1">
    <div class="row">
      <div class="col-lg-4 d-flex">
        <div class="">
          <img class="main-icon" :src="kioskIcon" alt="">
        </div>
        <div class="flex-grow-1 ms-3" style="margin-top: -14px;">
          <div class="d-flex">
            <span class="fs-2 fw-bold">KIOSK</span>
            <div class="flex-grow-1">
              <button type="button" class="btn indicator rounded-pill btn-icon" :class="connected ? ' btn-success':' btn-danger'">
              </button>
            </div>
            <span @click="goToSetting"><i class="fs-3 fa-solid fa-gear"></i></span>
          </div>
          <div class="d-flex small">
            <div class="col-lg-3">Kios Name</div>
            <div class="col-lg">: {{ envConfig.RENDERER_VITE_KIOSK_LABEL }}</div>
          </div>
          <div class="d-flex small" style="margin-top: -3px;">
            <div class="col-lg-3">Operator</div>
            <div class="col-lg">: {{ userName }}</div>
          </div>
          <div class="d-flex small" style="margin-top: -3px;">
            <div class="col-lg-3">Versi</div>
            <div class="col-lg">: {{ versi }}</div>
          </div>
          <!-- <div class="d-flex" style="margin-bottom: -2px !important;">
            <small class="text-uppercase">kios label</small>
            <small class="fw-bold ms-2 text-uppercase">{{ envConfig.RENDERER_VITE_KIOSK_LABEL }}</small>
          </div>
          <div class="d-flex" style="margin-bottom: -2px !important;">
            <small class="text-uppercase">operator</small>
            <small class="fw-bold ms-2 text-uppercase">{{ userName }}</small>
          </div>
          <div class="d-flex">
            <small class="text-uppercase">ip address</small>
            <small class="fw-bold ms-2 text-uppercase">{{ envConfig.RENDERER_VITE_KIOSK_URL }}</small>
          </div> -->
        </div>
      </div>
      <div class="col-lg-5">
        <EventPanel @click-event="getEventId" />
      </div>
      <div class="col-lg-3">
        <OrderPanel :event-id="eventId" @event-trigerr="getOrderList"/>
      </div>
    </div>
  </div>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-lg-4 d-flex">
        <div class="me-4">
          <ReportPanel/>
        </div>
        <div class="flex-grow-1">
          <select v-model="meta.status" @change="getOrderList" class="form-select form-select-lg">
            <option class="fs-3" v-for="(filter, index) in filterList" :key="index" :value="filter.value">{{ filter.display }}</option>
          </select>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="input-group input-group-merge">
          <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
          <input v-model="meta.search" @keyup="getDataBySearch" type="text" class="form-control form-control-lg" placeholder="Search..." aria-label="Search..."
            aria-describedby="basic-addon-search31">
        </div>
      </div>
      <div class="col-lg-3">
        <SearchByQr @reactivated="reactiveFromQrSearch"/>
      </div>
    </div>
  </div>
  <div class="container-fluid mt-3">
    <div class="card py-1 order-list table-responsive text-nowrap">
      <table class="table table-border">
        <thead>
          <tr>
            <th style="width: 38%;">Detail</th>
            <th style="width: 22%;">Payment</th>
            <th style="width: 24%;">Date</th>
            <th style="width: 15%;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in payloadList" :key="index"
            :class="order.status === 'expired' ? 'bg-cs-muted' : ''">
            <td>
              <ul class="list-group">
                <li class="d-flex">
                  <span class="col-lg-3">
                    Order number
                  </span>
                  <span class="ms-3 col-lg-9">: {{ order.no_order }}</span>
                </li>
                <li v-if="order.status !== 'expired'" class="d-flex">
                  <span class="col-lg-3">
                    Booking code
                  </span>
                  <span class="ms-3 col-lg-9">: {{ order.booking_code }}</span>
                </li>
              </ul>
            </td>
            <td>
              <ul v-if="order.status !== 'expired'" class="list-group">
                <li class="d-flex">
                  <span class="col-lg-3">
                    Receive
                  </span>
                  <span class="ms-3 col-lg-9">: Rp. {{ Currency.rupiahValue(order.total_price_receive) }}</span>
                </li>
                <li class="d-flex">
                  <span class="col-lg-3">
                    Method
                  </span>
                  <span class="ms-3 col-lg-9">: {{
                    order.payment_method_name ? order.payment_method_name : 'Cash'
                  }}</span>
                </li>
              </ul>
            </td>
            <td>
              <ul class="list-group">
                <li v-if="order.status !== 'expired'" class="d-flex">
                  <span class="col-lg-3">
                    Pay date
                  </span>
                  <span class="ms-3 col-lg-9">: {{ moment(order.payment_date).format('DD MMM, YYYY | HH:mm') }}</span>
                </li>
                <li class="d-flex">
                  <span class="col-lg-3">
                    Status
                  </span>
                  <span class="ms-3 col-lg-9">: {{ order.status }}</span>
                </li>
              </ul>
            </td>
            <td>
              <ul v-if="order.status == 'validated'" class="list-group">
                <li class="d-flex">
                  <BaseButton @click-event="showHideModal({model: 'detail-order', type:'open', orderId: order.id})" class="btn-xl btn-primary"><i class="bx bx-receipt fs-3 m-2"></i></BaseButton>
                  <BaseButton @click-event="showHideModal({model: 'qr-code', type:'open', orderId: order.id})" class="btn-xl bg-cs-orange ms-3"><i class="text-white bx bx-qr fs-3 m-2"></i></BaseButton>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="payloadList.length == 0" class="d-flex justify-content-center mt-5 text-muted">
        <span class="fs-3">No transaction avaible</span><span><i style="font-size: 30pt;" class="ms-3 fa-regular fa-face-sad-cry"></i></span>
      </div>
    </div>
  </div>
  <div class="container-fluid mt-4">
    <div class="float-start">
      <TimeWithShutdown/>
    </div>
    <div class="float-end">
      <Paggination @click-event="paginate" :config="meta" />
    </div>
  </div>

  <BaseModal @click-event="showHideModal({model: 'qr-code', type:'close'})" label="Reprint QR" sizing="modal-lg" modal-id="qr-code">
    <template v-slot:body>
      <div class="d-flex" style="margin-top: -15px;">
        <span class="card-title">Select ticket or print all</span>
        <span v-if="orderDetail.detail_ticket.length === 0" class="card-title">Ticket order has been refunded</span>
      </div>
      <div class="m-2">
        <div class="row">
          <div class="col-lg-12" v-if="orderDetail">
            <div class="p-1 row justify-content-center" style="margin-top: -10px;" id="qrSelected">
              <a v-for="(seat, index) in orderDetail.detail_ticket" :key="index" @click="addTicketList({id: seat.id, bench_number: seat.bench_number})" :id="`ticket-${seat.id}`" 
              role="button" class="col-lg-2 bg-cs-muted text-center py-3 fs-5 m-2 rounded text-white">
                {{ seat.bench_number.toUpperCase() }}</a>
            </div>
          </div>
          <div class="col-lg-12 mt-5 d-flex justify-content-center" v-if="orderDetail.detail_ticket.length >= 1">
            <BaseButton @click-event="printQr(ticketList.length < 1 ? 'all' : '')" :disabled="printButton" class="btn-lg btn-primary float-end fs-3"><i class='fs-3 fas fa-print'></i> PRINT {{ ticketList.length >= 1 ? ticketList.length : 'All' }}</BaseButton>
            <BaseButton @click-event="loginFrom" type-button="reactivated" :disabled="ticketList.length >= 1 ? false : true" class="btn-lg bg-cs-orange text-white float-start fs-3 ms-3"><i class="fa-solid fa-qrcode"></i> REACTIVATED</BaseButton>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>

  <BaseModal @click-event="showHideModal({model: 'detail-order', type:'close'})" label="Detail Order" sizing="modal-xl" modal-id="detail-order">
    <template v-slot:body>
      <div class="span card-title" style="margin-top: -25px !important;">
        BOOKING CODE #{{ orderDetail.order.booking_code }}
      </div>
      <div class="row">
        <div class="col-lg-6">
          <ul class="list-group mt-1">
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-3">Order number</div>
                <div class="col">: {{ orderDetail.order.no_order }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-3">Order date</div>
                <div class="col">: {{ moment(orderDetail.order.created_at).format('DD MMM, YYYY | HH:mm') }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-3">Total price</div>
                <div class="col">: Rp {{ Currency.rupiahValue(orderDetail.order.total_price) }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-3">Total order</div>
                <div class="col">: {{ orderDetail.order.total_order }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-6">
          <ul class="list-group mt-1">
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-4">Payment method</div>
                <div class="col">: {{ orderDetail.order.payment_method_name }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-4">Payment date</div>
                <div class="col">: {{ moment(orderDetail.order.payment_date).format('DD MMM, YYYY | HH:mm') }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-4">Total Receive</div>
                <div class="col">: Rp {{ Currency.rupiahValue(orderDetail.order.total_price_receive) }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-4">Refund</div>
                <div class="col">: Rp {{ Currency.rupiahValue(orderDetail.refund ? orderDetail.refund : 0) }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-6 mt-4">
          <span class="form-label">About Event</span>
          <ul class="list-group mt-2">
            <li class="list-group">
              <div class="row">
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Event code</span>
                  <span>{{ orderDetail.event.code }}</span>
                </div>
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Event name</span>
                  <span>{{ Other.splitName(orderDetail.event.name) }}</span>
                </div>
              </div>
            </li>
            <li class="list-group mt-2">
              <div class="row">
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Start date</span>
                  <span>{{ moment(orderDetail.event.event_date).format('DD MMM, YYYY | HH:mm') }}</span>
                </div>
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">End date</span>
                  <span>{{ moment(orderDetail.event.event_end_date).format('DD MMM, YYYY | HH:mm') }}</span>
                </div>
              </div>
            </li>
            <li class="list-group mt-3">
              <div class="row">
                <div class="col-lg">
                  <div class=" form-label my-label text-muted">Event address</div>
                  <div class="">{{ orderDetail.event.address }} lore</div>
                </div>
              </div>
              <div class="row mt-5">
                <div class="col-lg-4"><button @click="loginFrom({dataId: orderDetail.order.id, typeButton: 'refund'})" class="btn btn-danger btn-lg">REFUND</button></div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-6 mt-4">
          <span class="form-label">About Ticket Order</span>
          <ul class="list-group mt-2" v-if="orderDetail.detail_ticket.length >= 1">
            <li class="list-group">
              <div class="row">
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Customer name</span>
                  <span>{{ orderDetail.detail_ticket[0].order_gender === 'L' ? 'Tn.' : 'Ny.' }} {{ Other.splitName(orderDetail.detail_ticket[0].order_name) }}</span>
                </div>
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Email</span>
                  <span>{{ Other.splitName(orderDetail.detail_ticket[0].order_email) }}</span>
                </div>
              </div>
            </li>
            <li class="list-group mt-2">
              <div class="row">
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Phone number</span>
                  <span>+{{ orderDetail.detail_ticket[0].order_handphone }}</span>
                </div>
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Ticket status</span>
                  <span>{{ orderDetail.detail_ticket[0].ticket_status }}</span>
                </div>
              </div>
            </li>
            <li class="list-group mt-2">
              <div class="row">
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Bench area</span>
                  <span>{{ Other.splitName(orderDetail.detail_ticket[0].bench_area.toUpperCase()) }}</span>
                </div>
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Total Ticket</span>
                  <span>{{ orderDetail.detail_ticket.length }} Seat</span>
                </div>
              </div>
            </li>
            <li class="list-group mt-2">
              <div class="row py-2">
                <span class="form-label my-label text-muted">Check in status</span>
                <div class="col-lg-12 mt-2">
                  <div class="row py-1 px-2">
                    <span style="padding: 8px !important; width: fit-content !important;" 
                    v-for="(seat, index) in orderDetail.detail_ticket" :key="index"
                    class="col-lg-2 m-1 card text-white bg-cs-seat">
                      {{ seat.bench_number.toUpperCase() }} : {{ seat.status.toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </BaseModal>

  <BaseModal @click-event="showHideModal({model: 'confirm-modal', type:'close'})" label="" sizing="" modal-id="confirm-modal">
    <template v-slot:body>
      <div class="px-4">
        <h3 class="text-center" style="position: relative; top: -65px; margin-bottom: -65px;">Confirmation</h3>
        <div class="form-group mt-5">
          <BaseInput v-model="loginPayload.username" label="Username" placeholder="Input username here..." type-of="text" maxLength="50" />
          <div v-if="message != null">
            <span v-for="error in v3$.username.$errors" :key="error.$uid">
              <small class="text-danger text-lowercase">{{ error.$message }}</small>
            </span>
          </div>
        </div>
        <div class="form-password-toggle mt-3">
          <label class="form-label" for="basic-default-password12">Password</label>
          <div class="input-group">
            <input v-model="loginPayload.password" :type="isHidden ? 'password':'text'" class="form-control" placeholder="············" aria-describedby="basic-default-password2"
            maxlength="80">
            <span @click="passHidden" class="input-group-text cursor-pointer"><i :class="isHidden? 'bx bx-hide':'bx bx-show'"></i></span>
          </div>
          <div v-if="message != null">
            <span v-for="error in v3$.password.$errors" :key="error.$uid">
            <small class="text-danger text-lowercase">{{ error.$message }}</small>
          </span>
          </div>
        </div>
        <div class="d-flex justify-content-center mt-4">
          <div>
            <button type="button" class="btn btn-primary btn-lg me-5" @click="loginProcess()">Confirm</button>
          </div>
          <div>
            <button type="button" class="btn btn-danger btn-lg ms-5" @click="showHideModal({model: 'confirm-modal', type: 'close'})">Cancel</button>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>

</template>
<style>
  .my-label{
    margin-bottom: -1px !important;
  }
  
  button[disabled] {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
<script setup>
import moment from 'moment'
import jwt_decode from 'jwt-decode'
import { useRouter } from "vue-router"
import Modal from 'bootstrap/js/dist/modal'
import { useVuelidate } from '@vuelidate/core'
import kioskIcon from '../assets/img/kiosk.png'
import BaseModal from '../components/BaseModal.vue';
import Paggination from '../components/Paggination.vue'
import { required, helpers, maxLength } from '@vuelidate/validators'
import BaseButton from '../components/Button/BaseButton.vue'
import EventPanel from '../components/skelton/EventPanel.vue'
import OrderPanel from '../components/skelton/OrderPanel.vue';
import { onMounted, ref, reactive, onBeforeMount, computed } from 'vue';
import TimeWithShutdown from '../components/skelton/TimeWithShutdown.vue';

import Order from '../utils/Order'
import Ticket from '../utils/Ticket'
import Invoke from '../utils/Invoke';
import Confirm from '../utils/Confirm'
import Currency from '../utils/Currency'
import Merchant from '../utils/Merchant'
import ErrorLogs from '../utils/ErrorLogs'
import AuthCheck from '../utils/AuthCheck'
import HeartBeat from '../utils/HeartBeat'
import Sweetalert from '../utils/Sweetalert'
import BaseInput from '../components/input/BaseInput.vue'
import SearchByQr from '../components/skelton/SearchByQr.vue'
import ReportPanel from '../components/skelton/ReportPanel.vue'
import Other from '../utils/Other'

// GET FUNCTION
// ##########################################################
const payloadList = ref([])
const versi = import.meta.env.RENDERER_VITE_APP_VERSION

const meta = reactive({
  page: 1,
  limit: 10,
  total: 0,
  search: '',
  status: '',
  checkout: '',
  paid: ''
})

const getOrderList = () => {
  Order.getList(meta)
    .then((res) => {
      let item = res.data
      payloadList.value = item.data
      meta.total = item.meta.total
    })
    .catch((err) => {
      if (err.response && err.response.status != 0) {
        let code = err.response.status
        Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
        ErrorLogs.writeToLog(`${err.response.status} | GetOrderList - ${err.response.data.message}`)
      } else {
        Sweetalert.alertError(AuthCheck.defaultErrorResponse())
        ErrorLogs.writeToLog(err.message)
      }
    })
}

const getDataBySearch = () => {
  meta.page = 1
  getOrderList()
  paginate
}

// ORDER DETAIL FUNCTION
// ##########################################################
const orderDetail = reactive({
  order: {
    id: null,
    no_order: '',
    booking_code: '',
    total_order: 0,
    total_price: 0,
    is_checkout: true,
    is_paid: true,
    total_price_receive: 100000,
    payment_date: '',
    status: '',
    payment_method_name: '',
    created_at: '',
  }, 
  event: {
    id: null,
    merchant_id: null,
    code: '',
    name: '',
    address: '',
    event_date: '',
    event_end_date: '',
  },
  detail_ticket: []
})

const getOrderDetail = (orderId) => {
  orderDetail.value = []
  Order.detail(orderId)
  .then((res) => {
    let item = res.data
    for (const key in orderDetail) {
      if (key != 'detail_ticket') {
        for (const key2 in orderDetail[key]) {
          orderDetail[key][key2] = item.data[key][key2]
        }
      } else if (key == 'detail_ticket'){
        orderDetail.detail_ticket = item.data[key]
      }
    }
  })
  .catch((err) => {
    qrModal.value.hide()
    detailModal.value.hide()
    if (err.response && err.response.status != 0) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
      ErrorLogs.writeToLog(`${err.response.status} | GetOrderDetail - ${err.response.data.message}`)
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
      ErrorLogs.writeToLog(err.message)
    }
  })
}

// QR-CODE PRINT FUNCTION
// ##########################################################
const ticketList = ref([])

const addTicketList = (params) => {
  const ticket = document.getElementById(`ticket-${params.id}`)

  if (ticket.classList.contains('bg-cs-muted')) {
    ticketList.value.push(params)

    ticket.classList.remove('bg-cs-muted')
    ticket.classList.add('bg-cs-orange')

  } else if (!ticket.classList.contains('bg-cs-muted')){
    ticketList.value = ticketList.value.filter(el => el.id !== params.id)

    ticket.classList.remove('bg-cs-orange')
    ticket.classList.add('bg-cs-muted')
  }

}

const qrcode = localStorage.getItem('RENDERER_VITE_GOOGLE_CLOUD_STORAGE_URL');
const printButton = ref(false)

const merchantName = ref('')
const getMerchantName = () => {
  let merchantId = localStorage.getItem('RENDERER_VITE_MERCHANT_ID')
  Merchant.getDetail(merchantId)
  .then((res) => {
    let item = res.data
    merchantName.value = item.data.name
  })
  .catch((err) => {
    qrModal.value.hide()
    detailModal.value.hide()
    if (err.response && err.response.status != 0) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
      ErrorLogs.writeToLog(`${err.response.status} | GetMerchantName - ${err.response.data.message}`)
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
      ErrorLogs.writeToLog(err.message)
    }
  })
}

const printQr = async (type) => {
  printButton.value = true

  let struk = orderDetail.detail_ticket
  const structData = {
    path_file: 'struct.html',
    merchant: merchantName.value,
    label: localStorage.getItem('RENDERER_VITE_KIOSK_LABEL'),
    no_order: orderDetail.order.no_order,
    booking_code: orderDetail.order.booking_code,
    event_code: orderDetail.event.code,
    event_name: orderDetail.event.name,
    start_date: moment(orderDetail.event.event_date).format('DD MMM, YYYY | HH:mm'),
    end_date: moment(orderDetail.event.event_end_date).format('DD MMM, YYYY | HH:mm'),
    detail_ticket: []
  }
  if (type === 'all') {
    for await (const key of orderDetail.detail_ticket) {
      structData.detail_ticket.push({
        bench_area: key.bench_area,
        bench_number: key.bench_number,
        qr_path: qrcode + key.qr_path,
      })
    }
  } else {
    for await (const key of struk) {
      for (const key2 of ticketList.value) {
        if (key.id !== key2.id) {
          continue
        }
        structData.detail_ticket.push({
          bench_area: key.bench_area,
          bench_number: key.bench_number,
          qr_path: qrcode + key.qr_path,
        })
      }
    }
  }

  Invoke.printFunction(structData)
  .then((res) => {
    showHideModal({model: 'qr-code', type: 'close'})
    printButton.value = false
    structData.detail_ticket.length = 0
  })
}

// FROM SEARCH QR
const reactiveFromQrSearch = (orderId) => {
  loginFrom({typeButton: 'reactivated'})
  reactivePayload.order_ticket_id = orderId

  document.getElementById('closeOfCanvasSearch').click()
}
// ##########################################################

// REFUND & REACTIVATED FUNCTION
const orderId = ref(0)
const typeConfirm = ref('')

const loginFrom = (params) => {
  if (params.typeButton == 'refund') {
    orderId.value = params.dataId
    showHideModal({model: 'detail-order', type: 'close'})
    typeConfirm.value = 'refund'
  } else if (params.typeButton == 'reactivated'){
    qrModal.value.hide()
    typeConfirm.value = 'reactivated'
    console.log(ticketList.value);
  }
  showHideModal({model: 'confirm-modal', type: 'open'})
}

const isHidden = ref(true)

const passHidden = () => {
  isHidden.value ? isHidden.value = false : isHidden.value = true
}

const loginPayload = reactive({
  username: '',
  password: ''
})

const refundPayload = reactive({
  order_id: 0,
  description: 'Batal',
  confirm_by: ''
})

const reactivePayload = reactive({
  order_ticket_id: 0,
  description: '',
  confirm_by: ''
})

const notSimbols = helpers.regex(/^\w+$/)

const loginRules = computed(() => {
  return {
    username: {
      required,
      maxLengthValue: maxLength(50),
    },
    password: { required }
  }
})

let v3$ = useVuelidate(loginRules, loginPayload)
const message = ref(null)

const loginProcess = async () => {
  const validate = await v3$.value.$validate()
  message.value = v3$.value
  if (validate) {
    showHideModal({model: 'all-modal'})
    Sweetalert.alertLoading()
    Confirm.withPassword(loginPayload, localStorage.getItem('user'))
    .then((res) => {
      const item = res.data
			const scope = item.data.scope
      const verifiedPersonalData = scope.some((i) => {
        if (i.name !== "gate-ticketing-svc") {
          return false;
        }
        return i.roles.some(
          (role) => role.roles_name === "admin" || role.roles_name === "staff" || role.roles_name === "cashier"
        );
      });
      
      if (verifiedPersonalData) {
        if (typeConfirm.value == 'refund') {
          refundPayload.confirm_by = item.data.users.username
          refundPayload.order_id = orderId.value
          sendRefund()
        } else if (typeConfirm.value == 'reactivated') {
          reactivePayload.confirm_by = item.data.users.username
          sendReactivate()
        }
      } else {
        Sweetalert.alertError('You not have current roles')
        clearLoginPayload()
      }

      isHidden.value = true
    })
    .catch((err) => {
      isHidden.value = true
      showHideModal({modal: 'all-modal'})
      clearLoginPayload()
      if (err.response && err.response.status != 0) {
        let code = err.response.status
        if (code == 401 || code == 422) {
          Sweetalert.alertError('Username and password not found!')
        } else {
          Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin))
        }
        ErrorLogs.writeToLog(`${err.response.status} | LoginProcessOnMainMenu - ${err.response.data.message}`)
      } else {
        Sweetalert.alertError(AuthCheck.defaultErrorResponse())
        ErrorLogs.writeToLog(err.message)
      }
    })
  }
}


const sendRefund = () => {
  Order.refundOrder(refundPayload)
  .then((res) => {
    Sweetalert.alertSuccess('User has been confirmed')
		clearLoginPayload()
  })
  .catch((err) => {
    if (err.response && err.response.status != 0) {
      let code = err.response.status
      if (code == 401 || code == 422) {
      Sweetalert.alertError('Refund order in progress!')
      } else {
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin))
      }
      ErrorLogs.writeToLog(`${err.response.status} | SendRefund - ${err.response.data.message}`)
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
      ErrorLogs.writeToLog(err.message)
    }
    console.log(err);
  })
}

const sendReactivate = () => {
 try {
  console.log(ticketList.value);
  if (ticketList.value.length >= 1) {
    for (const key in ticketList.value) {
      reactivePayload.order_ticket_id = ticketList.value[key].id
      
      Ticket.reactiveTicket(reactivePayload).then((res) => {
        console.log(res);
        Sweetalert.alertSuccess('User has been confirmed')
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status != 0) {
          let code = err.response.status
          ErrorLogs.writeToLog(`${err.response.status} | SendRefund - ${err.response.data.message}`)
          Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin))
        } else {
          ErrorLogs('Send Reactive Error on MainMenu.vue')
        }
      })
    }
  } else {
    Ticket.reactiveTicket(reactivePayload).then((res) => {
      Sweetalert.alertSuccess(res.data.message)
    })
    .catch((err) => {
      console.log(err);
      if (err.response && err.response.status != 0) {
        let code = err.response.status
        ErrorLogs.writeToLog(`${err.response.status} | SendRefund - ${err.response.data.message}`)
        Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin))
      } else {
        ErrorLogs('Send Reactive Error on MainMenu.vue')
      }
    })
  }
 } catch {
  ErrorLogs('Send Reactive Error on MainMenu.vue')
 }

}

const clearLoginPayload = () => {
  loginPayload.username = ''
  loginPayload.password = ''

  v3$.value.$reset()
}
// ##########################################################

// ANOTHER FUNCTION
// ##########################################################

const envConfig = reactive({
  RENDERER_VITE_KIOSK_LABEL: "",
  RENDERER_VITE_KIOSK_URL: "",
  RENDERER_VITE_MERCHANT_ID: ""
})

const getSetupConfig = () => {
  for (const key in envConfig) {
    envConfig[key] = localStorage.getItem(key)
  }
}

const eventId = ref(null)

const getEventId = (params) => {
  eventId.value = params
}

const filterList = [
  { value: '', display: 'All Status' },
  { value: 'validated', display: 'Validated' },
  { value: 'progress', display: 'Progress' },
  { value: 'unpaid', display: 'Unpaid' },
  { value: 'expired', display: 'Expired' }
]

const paginate = (params) => {
  meta.page = params
  getOrderList()
}

const qrModal = ref(null)
const detailModal = ref(null)
const confirmModal = ref(null)

const removeSelectedTicket = () => {
  let div    = document.querySelector('#qrSelected')
  let buttons = div.getElementsByTagName('a')

  for (let i = 0; i < buttons.length; i++) {
  let button = buttons[i];

    // Memeriksa apakah elemen memiliki kelas bg-cs-orange
    if (button.classList.contains("bg-cs-orange")) {
      // Menghapus kelas bg-cs-orange
      button.classList.remove("bg-cs-orange");
      // Menambahkan kelas bg-cs-muted
      button.classList.add("bg-cs-muted");
    }
  }
}

const showHideModal = (params) => {
  switch (params.model) {
    case 'qr-code':
      if (params.type === 'open') {
        ticketList.value = []
        removeSelectedTicket()
        
        getOrderDetail(params.orderId)
        
        qrModal.value.show()
      } else if (params.type === 'close')
        // ticketList.value = [] 
        orderDetail.detail_ticket = []
        qrModal.value.hide()
      break;
  
    case 'detail-order':
      if (params.type === 'open') {
        getOrderDetail(params.orderId)

        detailModal.value.show()
      } else if (params.type === 'close')
        detailModal.value.hide()
      break

    case 'confirm-modal':
      if (params.type === 'open') {
           
        confirmModal.value.show()
      } else if (params.type === 'close')
        confirmModal.value.hide()
        // ticketList.value = []
        clearLoginPayload()
      break
    
    case 'all-modal':
      qrModal.value.hide()
      detailModal.value.hide()
      confirmModal.value.hide()
      break
  }
}

const userName = ref('')

const getUserName = () => {
  const token = localStorage.getItem('user')
  const decoded = jwt_decode(token);
  
  userName.value = decoded.name
}

const router = useRouter()

const goToSetting = () => {
  router.replace('/setting')
}

const goToLogin = () => {
  router.push("/auth/login")
}

onBeforeMount(() => {
  try {
    let appEnv = import.meta.env.RENDERER_VITE_APP_ENV
    if (AuthCheck.envTransform(appEnv) != 'local') {

      const userToken = localStorage.getItem("user")
      if (!userToken) {
        goToLogin()
      }
    }
  } catch {
    ErrorLogs.writeToLog('onBeforeMount function error on MainMenu.vue')
  }
})

const connected = ref(false)
const checkConnection = () => {
  HeartBeat.check()
  .then((res) => {
    connected.value = true
  })
  .catch((err) => {
    connected.value = false
  })
}

const interval = setInterval(() => {
  checkConnection()
}, 1000)

onMounted(() => {
  try {
    interval
    qrModal.value = new Modal('#qr-code', {
      keyboard: false
    })
    detailModal.value = new Modal('#detail-order', {
      keyboard: false
    })
    confirmModal.value = new Modal('#confirm-modal', {
      keyboard: false
    })
    
    getUserName()
    getSetupConfig()
    getMerchantName()
    getOrderList()

    v3$ = useVuelidate(loginRules, loginPayload)
  } catch (error) {
    clearInterval(interval)
    ErrorLogs.writeToLog(`On mounted MainMenu.vue: ${error}`)
  }
})
</script>