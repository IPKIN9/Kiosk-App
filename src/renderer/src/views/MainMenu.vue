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
              <button type="button" class="btn indicator rounded-pill btn-icon btn-success">
              </button>
            </div>
            <span @click="goToSetting"><i class="fs-3 fa-solid fa-gear"></i></span>
          </div>
          <div class="d-flex" style="margin-bottom: -2px !important;">
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
          </div>
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
      <div class="col-lg-4">
        <select v-model="meta.status" @change="getOrderList" class="form-select form-select-lg">
          <option class="fs-3" v-for="(filter, index) in filterList" :key="index" :value="filter.value">{{ filter.display }}</option>
        </select>
      </div>
      <div class="col-lg-8">
        <div class="input-group input-group-merge">
          <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
          <input v-model="meta.search" @keyup="getOrderList" type="text" class="form-control form-control-lg" placeholder="Search..." aria-label="Search..."
            aria-describedby="basic-addon-search31">
        </div>
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
                  <span class="ms-3 col-lg-9">: {{ Currency.rupiahValue(order.total_price_receive) }} Rp</span>
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

  <BaseModal @click-event="showHideModal({model: 'qr-code', type:'close'})" label="Reprint Qr" sizing="modal-lg" modal-id="qr-code">
    <template v-slot:body>
      <div class="d-flex" style="margin-top: -15px;">
        <span class="card-title">Select ticket or print all</span>
      </div>
      <div class="m-2">
        <div class="row">
          <div class="col-lg-12" v-if="orderDetail">
            <div class="p-1 row justify-content-center" style="margin-top: -10px;">
              <a v-for="(seat, index) in orderDetail.detail_ticket" :key="index" @click="addTicketList({id: seat.id, bench_number: seat.bench_number})" :id="`ticket-${seat.id}`" 
              role="button" class="col-lg-2 bg-cs-muted text-center py-3 fs-5 m-2 rounded text-white">
                {{ seat.bench_number.toUpperCase() }}</a>
            </div>
          </div>
          <div class="col-lg-12 mt-5 d-flex justify-content-center">
            <BaseButton @click-event="printQr(ticketList.length < 1 ? 'all' : '')" :disabled="printButton" class="btn-lg btn-primary float-end fs-3"><i class='fs-3 fas fa-print'></i> PRINT {{ ticketList.length >= 1 ? ticketList.length : 'All' }}</BaseButton>
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
                  <span>{{ orderDetail.event.name }}</span>
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
                <div class="col-lg-3 form-label my-label text-muted">Event address</div>
                <div class="col-lg-11">{{ orderDetail.event.address }}</div>
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
                  <span>{{ orderDetail.detail_ticket[0].order_gender === 'L' ? 'Tn.' : 'Ny.' }} {{ orderDetail.detail_ticket[0].order_name }}</span>
                </div>
                <div class="col-lg-6 row">
                  <span class="form-label my-label text-muted">Email</span>
                  <span>{{ orderDetail.detail_ticket[0].order_email }}</span>
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
                  <span>{{ orderDetail.detail_ticket[0].bench_area.toUpperCase() }}</span>
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

</template>
<style>
  .my-label{
    margin-bottom: -1px !important;
  }
</style>
<script setup>
import moment from 'moment'
import jwt_decode from "jwt-decode"
import { useRouter } from "vue-router"
import Modal from 'bootstrap/js/dist/modal'
import { onMounted, ref, reactive, onBeforeMount } from 'vue';
import kioskIcon from '../assets/img/kiosk.png'
import BaseModal from '../components/BaseModal.vue';
import Paggination from '../components/Paggination.vue'
import BaseButton from '../components/Button/BaseButton.vue'
import EventPanel from '../components/skelton/EventPanel.vue'
import OrderPanel from '../components/skelton/OrderPanel.vue';
import TimeWithShutdown from '../components/skelton/TimeWithShutdown.vue';
import Order from '../utils/Order'
import Invoke from '../utils/Invoke';
import Currency from '../utils/Currency'
import Merchant from '../utils/Merchant'
import AuthCheck from '../utils/AuthCheck'
import Sweetalert from '../utils/Sweetalert'

// GET FUNCTION
// ##########################################################
const payloadList = ref([])

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
      // if (err.response) {
      //   let code = err.response.status
      //   Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
      // } else {
      //   Sweetalert.alertError(AuthCheck.defaultErrorResponse())
      // }
    })
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
    console.log(err);
    // if (err.response) {
    //   let code = err.response.status
    //   Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    // } else {
    //   Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    // }
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

const qrcode = import.meta.env.RENDERER_VITE_GOOGLE_CLOUD_STORAGE_URL;
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
    console.log(err);
    // if (err.response) {
    //   let code = err.response.status
    //   Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    // } else {
    //   Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    // }
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

const eventId = ref()

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

const showHideModal = (params) => {
  switch (params.model) {
    case 'qr-code':
      if (params.type === 'open') {
        getOrderDetail(params.orderId)

        qrModal.value.show()
      } else if (params.type === 'close')
        ticketList.value = []
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
  let appEnv = import.meta.env.RENDERER_VITE_APP_ENV
  if (AuthCheck.envTransform(appEnv) != 'local') {

    const userToken = localStorage.getItem("user")
    if (!userToken) {
      goToLogin()
    }
  }
})

onMounted(() => {
  getUserName()
  getSetupConfig()
  getMerchantName()

  qrModal.value = new Modal('#qr-code', {
		keyboard: false
	})
  detailModal.value = new Modal('#detail-order', {
		keyboard: false
	})
  getOrderList()
})
</script>