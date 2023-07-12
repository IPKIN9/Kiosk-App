<template>
  <form>
    <div class="row py-1 px-4">
      <div class="form-group col-lg-4">
        <label class="form-label">Select Area</label>
        <select @focus="getAreaList()" v-model="ticketMeta.area" class="form-select form-select-lg" @change="() => {ticketMeta.page = 1; getTicketList();}">
          <option class="text-capitalize fs-3" :value="{id  : 0, name: ''}" disabled selected>-- Choice here --</option>
          <option class="text-capitalize fs-3" v-for="(item, index) in areaList" :key="index" :value="{id: item.id, name: item.bench_area}">{{ item.bench_area }}</option>
        </select>
      </div>
    </div>
    <hr>
    <div class="row py-3 px-4 mt-2">
      <div class="col-lg-3 box-seat">
        <div class="mb-4" v-for="(item, index) in areaSelected" :key="index">
          <h6 class="px-2 text-uppercase">AREA: <b>{{ item.area_name }}</b> : {{ item.ticket.length }}</h6>
          <div class="row">
            <div v-for="(data, index2) in item.ticket" :key="index2" class="col-lg-3 seat-select text-center">
              <span>{{ data.bench_number }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-9 box-seat">
        <span class="mb-2 ms-1">Select Ticket</span>
        <div class="row mt-2 me-1">
          <div v-for="(item, index) in ticketList" :key="index" class="col-lg-2 text-center">
            <span @click="addTicketData(item.event_area_id, {id: item.id, bench_number: item.bench_number})" class="seat" :class="checkTicketSelected(item.id, item.status, item.event_area_id)">{{ item.bench_number }}</span>
          </div>
          <span v-if="ticketList.length <= 0" class="text-center">No Ticket Avaible</span>
        </div>
      </div>
    </div>
  </form>
  <div class="row mt-4 mb-0 process-btn fixed-bottom mb-3 mx-3">
    <div class="col-lg-3 form-group">
      <Basebutton @click-event="closeModal()" typeButton="close-modal" class="btn-danger btn-xl py-2 px-4">Cancel</Basebutton>
      <Basebutton @click-event="() => {postOrder();}" :disabled="ticketList.length >= 1 ? false : true" class="btn-primary btn-xl py-2 px-4 ms-4">Process</Basebutton>
    </div>
    <div class="col-lg-9">
      <OrderPagination :page="ticketMeta.page" :limit="ticketMeta.limit" :total="ticketMeta.total" @event-click="paggination" />
    </div>
  </div>
</template>

<style scoped>
  .seat-select{
    padding: 5px 0;
    background-color: #F3AA60;
    color: white;
    border-radius: 5px;
    display: inline-block;
    margin: 5px;
    cursor: pointer;
  }

  .seat{
    width: 100%;
    padding: 35px 0;
    font-weight: 600;
    border-radius: 5px;
    display: inline-block;
    margin: 5px;
    cursor: pointer;
  }

  .seat-ready{
    background-color: #068FFF;
    color: white;
  }

  .box-seat{
    overflow-y: scroll;
    max-height: 550px;
  }

  .box-seat::-webkit-scrollbar {
    width: 8px;
  }

  .box-seat::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .box-seat::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .box-seat::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .seat-selected{
    background-color: #F3AA60;
    color: white;
  }

  .seat-taked{
    background-color: #DBDFEA;
    color: white;
    cursor: auto;
  }

  .disabled{
    pointer-events: none;
    cursor: not-allowed;
  }

  .process-btn{
    margin-top: auto;
    margin-left: auto;
  }
</style>

<script setup>
  import EventArea from '../../utils/EventArea.js'
  import { onMounted, reactive, ref, watch } from 'vue';
  import TicketByEvent from '../../utils/Ticket'
  import OrderPagination from './OrderPagination.vue'

  // import Pagination from './Pagination.vue'
  import Basebutton from '../Button/BaseButton.vue'
  
  const props = defineProps({
    eventId: {
      type   : Number,
      default: 0
    },
    first: {
      type   : Number,
      default: 0
    }
  })
  const emits = defineEmits(['modalAction'])

  /* ======= ORDER FUNCTION ========= */
  const areaSelected = reactive([])

  const customer = reactive({
    name       : ''   ,
    email      : ''   ,
    gender     : 'L'  ,
    no_hp      : ''   ,
    is_customer: false,
    description: ''   ,
  })

  const orderPayload = reactive({
    event_id    : 0,
    tax         : 0,
    due_date    : 15,
    order_detail: []
  })

  const postOrder = async () => {
    
    emits('modalAction', areaSelected)
  }

  /* ======= GET AREA LIST ========= */
  const areaList = ref([])

  const getAreaList = () => {
    EventArea.getList(props.eventId)
    .then((res) => {
      let item = res.data
      areaList.value = item.data
    })
    .catch((err) => {
      console.log(err);
    })
  }

  /* ======= GET TICKET LIST ========= */
  const ticketMeta = reactive({
    area: {
      id  : 0,
      name: ''
    } ,
    limit  : 54,
    page   : 1,
    total  : 0
  })
  const ticketList = ref([])

  const getTicketList = () => {
    TicketByEvent.getList(ticketMeta)
    .then((res) => {
      let item = res.data
      ticketList.value = item.data
      ticketMeta.total = item.meta.total

      setAreaName(ticketMeta.area)
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const paggination = (data) => {
    ticketMeta.page = data.n_page
    getTicketList()
  }

  /* ======= OTHER FUNCTION ========= */
  const clearInput = () => {
    ticketList.value = []
    areaSelected.length = 0
    orderPayload.event_id = 0
    
    for (const key in customer) {
      if (typeof customer[key] == 'string') {
        customer[key] = ''
      } else if (typeof customer[key] == 'number')
      {
        customer[key] = 0
      } else if (typeof customer[key] == 'boolean') {
        customer[key] = false
      }
    }
  }

  const closeModal = () => {
    clearInput()
    emits('modalAction', null)
  }

  const setAreaName = (area) => {
    areaSelected.forEach(function(item, index) {
      if ("ticket" in item && item.ticket.length < 1) {
        areaSelected.splice(index, 1);
      }
    });
    
    const existingData = areaSelected.find(data => data.id === area.id);
    if (areaSelected.length <= 0 || !existingData) {
      areaSelected.push({
        area_name: area.name,
        id       : area.id,
        ticket     : []
      });
    }
  }

  const addTicketData = (areaId, ticketData) => {
    const areaIndex = areaSelected.findIndex(item => item.id === areaId);

    if (areaIndex !== -1) {
        const existingTicketIndex = areaSelected[areaIndex].ticket.findIndex(existingTicket => existingTicket.id === ticketData.id);
        
        if (existingTicketIndex !== -1) {
            areaSelected[areaIndex].ticket.splice(existingTicketIndex, 1);
        } else {
            areaSelected[areaIndex].ticket.push(ticketData);
        }
    }
    
  }

  const checkTicketSelected = (ticketId, ticketStatus, eventAreaId) => {
    let isSelected = areaSelected.some(function(area) {
        return area.ticket.some(function(ticket) {
            return ticket.id === ticketId;
        });
    });

    if (ticketStatus == 'booked') {
      return 'seat-taked disabled'
    }

    const area = areaSelected.find((item) => item.id === eventAreaId);

    if (area) {
      const ticketLength = area.ticket.length;
      if (ticketLength >= 10) {
        return isSelected ? 'seat-selected' : 'disabled seat-ready'
      } else {
        return isSelected ? 'seat-selected' : 'seat-ready';
      }
    }
    
  }

  watch(props, (newProps) => {
    if (newProps.first <= 0) {
      ticketList  .value  = []
      areaSelected.length = 0
      ticketMeta  .total  = 0
      ticketMeta  .area   = {
        id   : 0,
        name : ''
      }
    }
  })

  onMounted(() => {
  })
</script>