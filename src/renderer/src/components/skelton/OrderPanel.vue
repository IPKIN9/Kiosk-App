<template>
  <a role="button" class="card bg-cs-orange px-2 py-2" :class="eventId && eventId.id === 0 ? 'disabled' : ''" @click="showOrderModal">
    <div class="d-flex">
      <div class="card btn-card bg-white rounded">
        <img :src="orderIcon" class="icon-img-2" alt="" />
      </div>
      <div class="ms-3 mt-2">
        <span class="d-flex text-white fs-6 rm-padding">Order</span>
        <span class="d-flex text-white fs-3 fw-bold rm-padding">{{
          eventId && eventId.id === 0 ? "No Event" : "Create Order"
        }}</span>
      </div>
    </div>
  </a>
  <BaseModal @click-event="showOrderModal" modal-id="orderedModal" :label="titlePanel" sizing="modal-fullscreen">
    <template v-slot:body>
      <div class="tab-content" style="margin: 0 !important; padding: 0 !important">

         <!-- Order Section -->

        <div class="tab-pane fade" :class="panelActive === 'order' ? 'show active' : ''" role="tabpanel">
          <div class="container-fluid row">
            <div class="col-lg-12 mb-3">
              <SelectSearch v-model="customerName" :id-input="{search: 'customerSearch', select: 'customerSelect'}" 
              :list-of-select="customerList" :list-config-display="customerDisplay" @search-event="searchCustomer" @event-click="setCustomerPayload" />
            </div>
            <div class="col-lg-6">
              <BaseInput v-model="customerPayload.name" label="Full Name" class="form-control-lg" :is-required="true"
                placeholder="Input here..." />
              <span v-for="error in v$.name.$errors" :key="error.$uid">
                <small class="text-danger text-lowercase">this name {{ error.$message }}</small>
              </span>
            </div>
            <div class="col-lg-6">
              <BaseInput v-model="customerPayload.email" label="Email" type-of="email" class="form-control-lg" :is-required="true"
                placeholder="Input here..." />
              <span v-for="error in v$.email.$errors" :key="error.$uid">
                <small class="text-danger text-lowercase">this email {{ error.$message }}</small>
              </span>
            </div>
          </div>
          <div class="container-fluid row mt-3">
            <div class="col-lg-6">
              <BaseInput v-model="customerPayload.no_hp" label="Phone Number" type-of="number" class="form-control-lg" :is-required="true"
                placeholder="Input here..." />
              <span v-for="error in v$.no_hp.$errors" :key="error.$uid">
                <small class="text-danger text-lowercase">this phone number {{ error.$message }}</small>
              </span>
            </div>
            <div class="col-lg-6">
              <label class="form-label">Gender</label>
              <span class="ms-1 form-text text-danger">*</span>
              <select v-model="customerPayload.gender" class="form-select form-select-lg">
                <option class="fs-3" selected disabled>-- Select --</option>
                <option class="fs-3" value="l">Laki-laki</option>
                <option class="fs-3" value="p">Perempuan</option>
              </select>
              <span v-for="error in v$.gender.$errors" :key="error.$uid">
                <small class="text-danger text-lowercase">this gender {{ error.$message }}</small>
              </span>
            </div>
            <div class="col-lg-6 mt-3">
              <BaseTextArea placeholder="Input here..." v-model="customerPayload.description" rows="9"
                label="Description" class="form-control-lg" />
            </div>
            <div class="col-lg-6" style="margin-top: 45px">
              <div>
                <ul class="list-group">
                  <li class="list-group">
                    <BaseButton @click-event="ticketShowUp" class="btn-xl btn-primary py-4">SELECT TICKET</BaseButton>
                  </li>
                  <div class="list-group mt-5">
                    <div class="d-flex form-label">Ticket selected:</div>
                    <div class="row py-1 px-2">
                      <span style="padding: 8px !important; width: fit-content !important;" class="col-lg-2 m-1 card bg-cs-muted" v-for="(ticket, index) in ticketSelectedList">{{ ticket.bench_number }}</span>
                    </div>
                    <div v-if="ticketSelectedList.length <= 0" class="col-lg-12 text-center">
                      <h5 class="text-danger">No Ticket Selected!</h5>
                    </div>
                  </div>
                </ul>
              </div>
              <div class="mt-5 float-end">
                <BaseButton :disabled="ticketSelectedList.length <= 0 ? true : false" @click-event="orderProccess" class="btn-lg bg-cs-orange text-white py-3">Next Step
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Ticket Section -->

        <div class="tab-pane fade" :class="panelActive === 'ticket' ? 'show active' : ''" role="tabpanel">
          <div class="container-fluid py-2">
            <div class="row">
              <div class="col-lg-4">
                <BaseSelectSearch :id-input="{search: 'areaSearch', select: 'areaSelect'}" v-model="areaName" @event-click="setArea" :list-of-select="areaList" :list-config-display="areaConfig"
                  label="Select Area" />
              </div>
              <div class="col-lg-2">
                <select @change="getTicketList()" v-model.number="ticketParams.limit" :disabled="ticketList.length >= 1 ? false : true" class="form-select form-control-lg">
                  <option class="fs-3 my-1" value="120">Show of 120</option>
                  <option class="fs-3 my-1" value="240">Show of 240</option>
                  <option class="fs-3 my-1" value="480">Show of 480</option>
                </select>
              </div>
              <div class="col-lg-6">
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="bx bx-search"></i></span>
                  <input @keyup="getTicketList()" v-model="ticketParams.search" type="text" :readonly="ticketList.length >= 1 ? false : true" class="form-control form-control-lg" placeholder="Search..." />
                </div>
              </div>
            </div>
            <div class="row mt-3 mx-1 border border-1 rounded p-3" style="height: 65vh">
              <div v-if="ticketSelectedList.length >= 1" class="col-lg-2 text-center border-end">
                <span class="form-label fs-5">Selected Ticket</span>
                <div class="mt-3">
                  <div v-for="(ticket, index) in ticketSelectedList" class="d-flex justify-content-center mt-1 fs-6">
                    {{ ticket.bench_number }}
                  </div>
                </div>
              </div>
              <div class="col-lg table-responsive text-nowrap" style="height: 60vh">
                <div v-if="ticketList.length <= 0" class="text-center mt-5">
                  <h2>Select Event Area Please</h2>
                </div>
                <div class="container">
                  <div class="row row-cols-6">
                    <div v-for="(ticket, index) in ticketList" :key="index" class="col-lg-2 col-sm-3">
                      <a role="button" @click.stop="ticketSelected({id: ticket.id, bench_number: ticket.bench_number})" 
                      :id="`ticketId-${ticket.id}`" 
                      class="ticket-button card py-4 text-white text-center fs-6 fw-bold mb-3" :class="ticket.status == 'ready' ? 'bg-cs-seat' : ticket.status == 'selected' ? 'bg-cs-orange' : 'bg-cs-muted disabled'">
                        {{ Other.getNumberOnly(ticket.bench_number) }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between mt-2">
              <div class="mt-3">
                <BaseButton @click-event="clearSelectedTicket" class="btn-xl btn-danger px-5">Clear</BaseButton>
              </div>
              <div class="mt-4">
                <Paggination :config="ticketParams" @click-event="paginateTicket" />
              </div>
              <div class="mt-3">
                <BaseButton @click-event="setToOrderPanel" :disabled="ticketSelectedList.length >= 1 ? false : true" class="btn-xl btn-primary px-5">Save</BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Section -->

        <div class="tab-pane fade" :class="panelActive === 'payment' ? 'show active' : ''" role="tabpanel">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-7">
                <div class="d-flex">
                  <div class="flex-grow-1"><h3 class="card-title">Payment Info</h3></div>
                </div>
                <ul class="list-group mb-5">
                  <CurrencyInput :class="isMatch" :disabled="disabledTotalPrice" v-model="payPayload.total_receive" />
                  <span v-for="error in v2$.total_receive.$errors" :key="error.$uid">
                    <small class="text-danger text-lowercase">total receive {{ error.$message }}</small>
                  </span>
                  
                  <li class="list-group fs-4 mt-2">
                    {{ refund }}
                  </li>
                </ul>
                <ul class="list-group mt-3">
                  <li class="list-group-item d-flex">
                    <span class="col-lg-3">Order number</span>
                    <span>: {{ payInfo.no_order }}</span>
                  </li>
                  <li class="list-group-item d-flex">
                    <span class="col-lg-3">Booking code</span>
                    <span>: {{ payInfo.booking_code }}</span>
                  </li>
                  <li class="list-group-item d-flex">
                    <span class="col-lg-3">Total order</span>
                    <span>: {{ payInfo.total_order }}</span>
                  </li>
                </ul>
                <ul class="list-group mt-3">
                  <li class="list-group-item d-flex">
                    <span class="col-lg-3 fs-3">Total price</span>
                    <span class="fs-3">: {{ Currency.rupiahValue(payInfo.total_price) }}</span>
                  </li>
                </ul>
                <ul class="list-group mt-3">
                  <li class="list-group-item d-flex">
                    <span class="col-lg-3">Ticket Selected</span>
                    <div class="row px-2">
                      <span style="padding: 8px !important; width: fit-content !important;" class="col-lg-2 m-1 card bg-cs-muted" v-for="(ticket, index) in ticketSelectedList">{{ ticket.bench_number }}</span>
                    </div>
                  </li>
                  <li class="list-group-item d-flex">
                    <span class="col-lg-3">Payment expired</span>
                    <span>: {{ moment(payInfo.payment_expired_date).format('DD MMM, YYYY | HH:mm') }}</span>
                  </li>
                  <li class="list-group-item d-flex">
                    <span class="col-lg-3">Payment status</span>
                    <span :class="payInfo.status ==='unpaid' ? 'text-danger' : 'text-success'">: {{ payInfo.status }}</span>
                  </li>
                </ul>
                <div class="mt-3 row">
                  <div class="col-lg-3">
                    <a @click="sendPayment" :class="payInfo.status === 'progress' ? 'disabled' : payInfo.status === 'validated' ? 'disabled' : isMatch === 'danger-input' ? 'disabled' : ''" role="button" class="card bg-cs-orange text-white text-center py-3 mt-2">
                      <span class="fs-3">
                        Pay Now
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-lg-5 px-3">
                <div v-if="!invoice.is_done" class="row">
                  <h3 class="card-title">Payment Method</h3>
                  <BaseSelect class="ms-2" @change="payMethod" v-model.number="payPayload.payment_method_id" :option-list="paymentList" :display-list="paymentDisplay" />
                  <div v-show="showNumpad" class="pt-4 px-5">
                    <NumericPad v-model="payPayload.total_receive" />
                  </div>
                </div>
                <div v-else class="row mt-5 px-5">
                  <div class="col-lg-6">
                    <ul class="list-group">
                      <li class="list-group fs-5">Order Number</li>
                      <li class="list-group fs-5 mt-2">Code Booking</li>
                      <li class="list-group fs-5 mt-2">Total Order</li>
                      <li class="list-group fs-5 mt-2">Total Receive</li>
                      <li class="list-group fs-5 mt-2">Status</li>
                      <li class="list-group fs-5 mt-2">Payment Method</li>
                      <li class="list-group fs-5 mt-2">Payment Date</li>
                    </ul>
                  </div>
                  <div class="col-lg-6">
                    <ul class="list-group">
                      <li class="list-group fs-5 text-end">{{ invoice.no_order }}</li>
                      <li class="list-group fs-5 text-end mt-2">{{ invoice.booking_code }}</li>
                      <li class="list-group fs-5 text-end mt-2">{{ invoice.total_order }}</li>
                      <li class="list-group fs-5 text-end mt-2">{{ Currency.rupiahValue( invoice.total_price_receive ) }}</li>
                      <li class="list-group fs-5 text-end mt-2 text-capitalize">{{ invoice.payment_method_name }}</li>
                      <li class="list-group fs-5 text-end mt-2 text-capitalize">{{ invoice.status }}</li>
                      <li class="list-group fs-5 text-end mt-2">{{ moment( invoice.payment_date ).format('DD MMM, YYYY | HH:mm') }}</li>
                    </ul>
                  </div>
                  <div v-if="showQrSend" class="col-lg-12 mt-5">
                    <div class="d-flex justify-content-around">
                      <!-- <a role="button" :class="printButton ? 'disabled' : ''" @click="printStruct" class="card py-4 px-5 text-white bg-primary">
                        <i class='fs-3 fas fa-print'></i>
                      </a> -->
                      <a role="button" :class="printButton ? 'disabled' : ''" @click="printQr" class="card py-4 px-5 text-white bg-cs-orange">
                        <i class='fs-3 fas fa-qrcode'></i>
                      </a>
                      <a role="button" :class="printButton ? 'disabled' : ''" class="card py-4 px-5 text-white bg-danger">
                        <i class='fs-3 fas fa-paper-plane'></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style>
.img-size {
  height: 11rem !important;
  width: auto !important;
}

.disabled {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  background-color: #b2b2b2 !important;
}

.non-shadow {
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
  border: none !important;
}
</style>

<script setup>
import { required, numeric, minLength, maxLength, helpers, email } from '@vuelidate/validators'
import { ref, reactive, watch, computed, onMounted, onBeforeMount } from "vue";
import { useVuelidate } from '@vuelidate/core'
import Modal from 'bootstrap/js/dist/modal'
import { useRouter } from 'vue-router'
import moment from 'moment'

import BaseSelectSearch from "../input/BaseSelectSearch.vue";
import CurrencyInput from "../input/CurrencyInput.vue";
import orderIcon from "../../assets/img/checkout.png";
import SelectSearch from "../input/SelectSearch.vue";
import BaseTextArea from "../input/BaseTextArea.vue";
import BaseButton from "../Button/BaseButton.vue";
import NumericPad from "../input/NumericPad.vue"
import BaseSelect from "../input/BaseSelect.vue";
import Sweetalert from "../../utils/Sweetalert";
import BaseInput from "../input/BaseInput.vue";
import AuthCheck from "../../utils/AuthCheck";
import EventArea from "../../utils/EventArea";
import Paggination from "../Paggination.vue";
import Customer from "../../utils/Customer"
import Currency from "../../utils/Currency"
import BaseModal from "../BaseModal.vue";
import Payment from "../../utils/Payment"
import Invoke from "../../utils/Invoke";
import Ticket from "../../utils/Ticket";
import Order from "../../utils/Order"
import Other from "../../utils/Other"
import Merchant from "../../utils/Merchant"

const titlePanel = ref("CUSTOMER FORM");

const qrcode = import.meta.env.RENDERER_VITE_GOOGLE_CLOUD_STORAGE_URL;
const emits = defineEmits(["eventTrigerr"]);
const props = defineProps({
  eventId: Object,
});

// Order function
// ######################################################################
const customerName = ref('')
const customerList = ref([])
const customerDisplay = {
  value: 'id',
  display: 'name'
}

const getCustomerList = () => {
  Customer.getList(customerName.value)
  .then((res) => {
    let item = res.data
    customerList.value = item.data
  })
  .catch((err) => {
    if (err.response) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    }
  })
}

const searchCustomer = async () => {
  if (customerName.value.length >= 1) {
    getCustomerList()
  } else {
    customerList.value = []
  }
}

const setCustomerPayload = (params) => {
  let customer = customerList.value[params]
  customerName.value = customer.name.toUpperCase()
  customerPayload.name = customer.name
  customerPayload.email = customer.email
  customerPayload.no_hp = customer.handphone

  customerList.value = []
}

const panelActive = ref("order");

const orderPayload = reactive({
  event_id: null,
  tax: 0,
  due_date: 2,
  order_detail: [],
});

const customerPayload = reactive({
  ticket_id: 0,
  name: "",
  gender: "l",
  email: "",
  no_hp: "",
  is_customer: false,
  description: "",
});

const notZero = helpers.regex(/^[1-9]/d);
const phoneRegex = helpers.regex(/^[+62]+/d);
const nameRegex = helpers.regex(/^[\w\s\d-\.]+$/d)

const rules = computed(() => {
  return {
    name: { 
      required,
      myField: helpers.withMessage("value cannot contain special characters", nameRegex)
    },
    gender: { required },
    email: {
      required,
      email,
    },
    no_hp: {
      required,
      numeric,
      minLengthValue: minLength(11),
      maxLengthValue: maxLength(13),
      myField: helpers.withMessage(
          "value must be 62 in first",
          phoneRegex
      ),
    }
  };
});

const v$ = useVuelidate(rules, customerPayload)

const orderProccess = async () => {
  const validate = await v$.value.$validate()

  orderPayload.order_detail = []
  let list = ticketSelectedList.value
  
  if (validate) {

    for await (const key of list) {
      orderPayload.order_detail.push({
        ticket_id: key.id,
        name: customerPayload.name,
        gender: customerPayload.gender,
        email: customerPayload.email,
        no_hp: customerPayload.no_hp,
        is_customer: false,
        description: customerPayload.description,
      })
    }

    Order.upsert(orderPayload)
    .then((res) => {
      let item = res.data
      panelActive.value = "payment";

      payPayload.order_id = item.data.order.id
      for (const key in payInfo) {
        payInfo[key] = item.data.order[key]
      }
    })
    .catch((err) => {
      if (err.response) {
        let code = err.response.status
        Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
      } else {
        Sweetalert.alertError(AuthCheck.defaultErrorResponse())
      }
    })
  }

  titlePanel.value = 'CUSTOMER FORM / PAYMENT'
};

// Ticket function
// ######################################################################
const ticketParams = reactive({
  eventarea: 0,
  limit: 120,
  page: 1,
  total: 0,
  search: ''
});

const ticketShowUp = () => {
  panelActive.value = "ticket";
  titlePanel.value = 'CUSTOMER FORM / TICKET'
  getAreaList();
};

const areaName = ref('')

const areaList = ref([]);
const areaConfig = {
  value: "id",
  display: "bench_area",
};

const getAreaList = () => {
  EventArea.getList(orderPayload.event_id)
  .then((res) => {
    let item = res.data;
    areaList.value = item.data;
  })
  .catch((err) => {
    if (err.response) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    }
  });
};

const setArea = (params) => {
  ticketParams.eventarea = params.value;
  areaName.value = params.display.toUpperCase()
  ticketSelectedList.value = []

  getTicketList();
};

const ticketList = ref([]);

const disabledSelectedTicket = () => {
  ticketList.value.splice(0, ticketList.value.length);
}

const getTicketList = () => {
  Ticket.getList(ticketParams)
  .then((res) => {

    let item = res.data;
    ticketList.value = item.data;
    ticketParams.total = item.meta.total

    for (const key in ticketList.value) {
      for (const itr of ticketSelectedList.value) {
        if (ticketList.value[key].id == itr.id) {
          ticketList.value[key].status = 'selected'
        }
      }
    }

    })
    .catch((err) => {
      if (err.response) {
        let code = err.response.status
        Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
      } else {
        Sweetalert.alertError(AuthCheck.defaultErrorResponse())
      }
    });
};

const paginateTicket = (params) => {
  disabledSelectedTicket()
  ticketParams.page = params
  getTicketList()

}

const ticketSelectedList = ref([])

const ticketSelected = (params) => {
  let button = document.getElementById(`ticketId-${params.id}`)
  
  if (button.classList.contains('bg-cs-seat') && ticketSelectedList.value.length < 10) {
    ticketSelectedList.value.push(params)

    button.classList.remove('bg-cs-seat')
    button.classList.add('bg-cs-orange')

  } else if (!button.classList.contains('bg-cs-seat') && ticketSelectedList.value.length >= 1){
    ticketSelectedList.value = ticketSelectedList.value.filter((el) => el.id !== params.id)

    button.classList.remove('bg-cs-orange')
    button.classList.add('bg-cs-seat')
  }
}

const clearSelectedTicket = () => {
  ticketSelectedList.value = []
  ticketList.value = []
  ticketParams.eventarea = 0
  areaList.value = []
  areaName.value = ''
  
  setToOrderPanel()
}

const setToOrderPanel = () => {
  panelActive.value = 'order'
  titlePanel.value = 'CUSTOMER FORM'
}


// Payment function
// ######################################################################
const isMatch = computed(() => {
  if (parseInt(Currency.unformat(payPayload.total_receive)) < parseInt(payInfo.total_price)) {
    return 'danger-input'
  } else if (parseInt(Currency.unformat(payPayload.total_receive)) >= parseInt(payInfo.total_price)) {
    return 'primary-input'
  } else {
    return 'danger-input'
  }
})

const payInfo = reactive({
  no_order: '',
  booking_code: '',
  total_price: '',
  payment_expired_date: '',
  status: '',
  total_order: ''
})

const payPayload = reactive({
  order_id: '',
  is_checkout: true,
  total_receive: 0,
  payment_method_id: 0
})

const refund = computed(() => {
  if (Currency.unformat(payPayload.total_receive) > payInfo.total_price) {
    let val = Currency.unformat(payPayload.total_receive) - payInfo.total_price
    return `Refund: ${Currency.rupiahValue(val)}`
  }
})

const paymentList = ref([])
const paymentDisplay = ({
  display: 'name',
  value: 'id'
})

const getPaymentList = () => {
  Payment.getList({
    limit: 50, page:1
  })
  .then((res) => {
    let item = res.data
    paymentList.value = item.data
  })
  .catch((err) => {
    if (err.response) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    }
  })
}

const showNumpad = ref(false)
const payName = ref('')

const payMethod = () => {
  let payList = paymentList.value
  let payMethod = payList.filter(o => o.id == payPayload.payment_method_id).map(o => o.name.toLowerCase())

  payName.value = payMethod[0]
  if (payMethod[0] === 'cash') {
    showNumpad.value = true
  } else {
    showNumpad.value = false
  }
}

const payRules = computed(() => {
  return {
    order_id: { required },
    total_receive: { 
      required,
      myField: helpers.withMessage("value cannot zero", notZero) 
    },
    payment_method_id: { 
      required,
      myField: helpers.withMessage("value cannot zero", notZero) 
    }
  }
})

const v2$ = useVuelidate(payRules, payPayload)

const sendPayment = async () => {
  payPayload.total_receive = Currency.unformat(payPayload.total_receive)
  
  let validate = await v2$.value.$validate()
  console.log(v2$.value.$errors);
  console.log(payPayload);
  if (validate) {
    Order.pay(payPayload)
    .then((res) => {
      let item = res.data
      
      if (payName.value.toLowerCase() === 'cash') {
        validatePayment(item.data.order.id)
      }
      payPayload.total_receive = Currency.rupiahValue(payPayload.total_receive)
      reloadPayInfo(item)
      disabledTotalPrice.value = true
    })
    .catch((err) => {
      if (err.response) {
        let code = err.response.status
        Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
      } else {
        Sweetalert.alertError(AuthCheck.defaultErrorResponse())
      }
    })
  }
}

const invoice = reactive({
  is_done: false,
  order_id: '',
  no_order: '',
  booking_code: '',
  total_order: '',
  status: '',
  payment_method_name: '',
  payment_date: '',
  total_price_receive: ''
})

const validatePayment = (orderId) => {
  Order.validate(orderId)
  .then((res) => {
    let item = res.data
    getOrderDetail(item.data.order.id)

    reloadPayInfo(item)
  })
  .catch((err) => {
    if (err.response) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    }
  })
}

const reloadPayInfo = (item) => {
  for (const key in payInfo) {
    if (key === "total_price") {
      payInfo[key] = Currency.rupiahValue(item.data.order[key])
    }
    payInfo[key] = item.data.order[key]
  }
}

const disabledTotalPrice = ref(false)

const strukInvoice = ref(null)
const showQrSend = ref(false)

const getOrderDetail = (orderId) => {
  Order.detail(orderId)
  .then((res) => {
    let item = res.data
    console.log(item);
    strukInvoice.value = item.data

    for (const key in invoice) {
      if (key === 'is_done') {
        invoice[key] = true
      } else {
        invoice[key] = item.data.order[key]
      }
    }

    showQrSend.value = true
  })
  .catch((err) => {
    if (err.response) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    }
  })
}

// Other function
// ######################################################################

watch(props, (newProps) => {
  if (newProps.eventId.id != 0) {
    let eventId = newProps.eventId.id;
    orderPayload.event_id = eventId;
  }
});

const orderModal = ref(null)
const showHideOrder = () => {
  orderModal.value.show() ? orderModal.value.show() : orderModal.value.hide()
}
const showOrderModal = (params) => {
  if (payInfo.status === 'unpaid' || payInfo.status === 'progress') {
    showHideOrder()
    Sweetalert.alertConfirm({
      title: 'Close this window?',
      confirmtext: 'Close'
    }).then((res) => {
      if (res.isConfirmed) {       
        cancelOrdered()
      } else {
        showHideOrder()
      }
    })
  } else {
    setToDefault()
    showHideOrder()
  }
}

const cancelOrdered = () => {
  Order.cancelOrder(payPayload.order_id)
  .then((res) => {
    setToDefault()
  })
  .catch((err) => {
    if (err.response) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    }
  })
}

const merchantName = ref('')
const getMerchantName = () => {
  let merchantId = localStorage.getItem('RENDERER_VITE_MERCHANT_ID')
  Merchant.getDetail(merchantId)
  .then((res) => {
    let item = res.data
    merchantName.value = item.data.name
  })
  .catch((err) => {
    if (err.response) {
      let code = err.response.status
      Sweetalert.alertError(AuthCheck.checkResponse(code, goToLogin()))
    } else {
      Sweetalert.alertError(AuthCheck.defaultErrorResponse())
    }
  })
}

const printButton = ref(false)

const printStruct = async () => {
  printButton.value = true

  const structData = {
    path_file: 'invoice.html',
    merchant: merchantName.value,
    label: localStorage.getItem('RENDERER_VITE_KIOSK_LABEL'),
    no_order: strukInvoice.value.order.no_order,
    booking_code: strukInvoice.value.order.booking_code,
    total_order: strukInvoice.value.order.total_order,
    total_price_receive: strukInvoice.value.order.total_price_receive,
    payment_method_name: strukInvoice.value.order.payment_method_name,
    payment_date: moment(strukInvoice.value.order.payment_date).format('DD MMM, YYYY | HH:mm')
  }

  Invoke.printFunction(structData)
  .then((res) => {
    printButton.value = false
    structData.detail_ticket.length = 0
  })
}

const printQr = async () => {
  printButton.value = true

  let struk = strukInvoice.value.detail_ticket
  const structData = {
    path_file: 'struct.html',
    merchant: merchantName.value,
    label: localStorage.getItem('RENDERER_VITE_KIOSK_LABEL'),
    no_order: strukInvoice.value.order.no_order,
    booking_code: strukInvoice.value.order.booking_code,
    event_code: strukInvoice.value.event.code,
    event_name: strukInvoice.value.event.name,
    start_date: moment(strukInvoice.value.event.event_date).format('DD MMM, YYYY | HH:mm'),
    end_date: moment(strukInvoice.value.event.event_end_date).format('DD MMM, YYYY | HH:mm'),
    detail_ticket: []
  }
  for await (const key of struk) {
    structData.detail_ticket.push({
      bench_area: key.bench_area,
      bench_number: key.bench_number,
      qr_path: qrcode + key.qr_path,
    })
  }

  Invoke.printFunction(structData)
  .then((res) => {
    printButton.value = false
      
    structData.detail_ticket.length = 0
  })
}

const clearCustomer = () => {
  customerPayload.ticket_id = 0
  customerPayload.name = ""
  customerPayload.email = ""
  customerPayload.no_hp = ""
  customerPayload.gender = "l"
  customerPayload.is_customer = false
  customerPayload.description = ""

  customerList.value = []
  customerName.value = ''
}

const clearticketParams = () => {
  ticketParams.limit = 120
  ticketParams.page = 1
  ticketParams.total = 0
  ticketParams.status = 'ready'
  ticketParams.use = false
  ticketParams.search = ''
}

const clearPayInfo = () => {
  for (const key in payInfo) {
    payInfo[key] = ''
  }
}

const clearPayPayload = () => {
  payPayload.order_id = ''
  payPayload.is_checkout = true
  payPayload.total_receive = 0
  payPayload.payment_method_id = 0
}

const clearInvoice = () => {
  for (const key in invoice) {
    if (key === 'is_done') {
      invoice[key] = false
    } else {
      invoice[key] = ''
    }
  }
}

const setToDefault = (type) => {
  v$.value.$reset()
  v2$.value.$reset()

  titlePanel.value = "CUSTOMER FORM"
  panelActive.value = 'order'

  ticketList.value = []
  ticketSelectedList.value = []
  showNumpad.value = false
  payName.value = ''
  strukInvoice.value = null
  showQrSend.value = false

  orderPayload.order_detail = []

  clearCustomer()
  clearticketParams()
  clearPayInfo()
  clearPayPayload()
  clearInvoice()
  clearSelectedTicket()

  emits('eventTrigerr')
}

const router = useRouter()

const goToLogin = () => {
    router.push("/auth/login")
  }

onBeforeMount(() => {
  let appEnv = import.meta.env.RENDERER_VITE_APP_ENVIRONMENT
  if (AuthCheck.envTransform(appEnv) != 'local') {
    const userToken = localStorage.getItem("user")
    if (!userToken) {
      goToLogin()
    }
  }
})

onMounted(() => {
  orderModal.value = new Modal('#orderedModal', {
    keyboard: false
	})
  
  getMerchantName()
  getPaymentList()
})
</script>
