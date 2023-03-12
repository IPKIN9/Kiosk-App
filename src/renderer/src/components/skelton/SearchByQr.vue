<template>
  <BaseButton @click-event="autFocus" class="bg-secondary text-white fs-4" style="width: 100% !important;" type="button" data-bs-toggle="offcanvas" data-bs-target="#searchByQr" aria-controls="searchByQr"><i class="fa-solid fa-qrcode me-3"></i><span>Search By <b>QR</b></span></BaseButton>

  <div class="offcanvas offcanvas-end" tabindex="-1" id="searchByQr" aria-labelledby="searchByQrLabel">
    <div class="offcanvas-header">
      <h4 class="offcanvas-title fw-bold" id="offcanvasWithBothOptionsLabel">SEARCH BY QR CODE</h4>
      <BaseButton @click-event="clearQrList" id="closeOfCanvasSearch" type-button="clear-search" class="btn-icon btn-cs-close" data-bs-dismiss="offcanvas" aria-label="Close">
        <i class="fs-1 fa-solid fa-xmark"></i>
      </BaseButton>
    </div>
    <div class="offcanvas-body">
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="fa-solid fa-qrcode"></i></span>
        <input v-model="qrCodePayload.qr_value" type="text" class="form-control form-control-lg" placeholder="Search by qr..." aria-label="Search..."
          id="auto-focus-search">
      </div>
      <ul v-show="qrCodeList.length >= 1" class="mt-4 list-group">
        <li class="list-group item">
          <div class="row">
            <div class="col-lg-4">Name</div>
            <div class="col-lg-8">: {{ qrCodeList.order_name }}</div>
          </div>
          <div class="row mt-2">
            <div class="col-lg-4">Gender</div>
            <div class="col-lg-8">: {{ qrCodeList.order_gender }}</div>
          </div>
          <div class="row mt-2">
            <div class="col-lg-4">Email</div>
            <div class="col-lg-8">: {{ qrCodeList.order_email }}</div>
          </div>
          <div class="row mt-2">
            <div class="col-lg-4">Handphone</div>
            <div class="col-lg-8">: +{{ qrCodeList.order_handphone }}</div>
          </div>
          <div class="row mt-2">
            <div class="col-lg-4">Status</div>
            <div class="col-lg-8">: {{ qrCodeList.status }}</div>
          </div>
          <div class="row mt-4">
            <div class="col-lg-6">
              <img v-if="qrCodeList.length >= 1" style="height: 140px; width: auto; border: 0.01rem solid grey;" :src="qrPath + qrCodeList.qr_path.String" alt="">
            </div>
            <div class="col-lg-5 me-2">
              <!-- <BaseButton class="bg-cs-orange text-white fs-5 mt-3" style="width: 100% !important;">Print QR</BaseButton> -->
              <BaseButton @click-event="reactivTicket" class="btn-primary fs-5" style="width: 100% !important; height: 100% !important;"><span>Reactivated</span>
              <span class="fa-solid fa-rotate fs-3"></span></BaseButton>
            </div>
          </div>
        </li>
      </ul>
      <ul v-show="qrCodeList.length < 1" class="list-group mt-5">
        <li class="list-group text-center">
          No ticket found
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
  import { reactive, watch } from 'vue';
  
  import BaseButton from '../Button/BaseButton.vue';
  import Order from '../../utils/Order';

  const emits = defineEmits(['printQr', 'reactivated'])

  const qrPath = localStorage.getItem('RENDERER_VITE_GOOGLE_CLOUD_STORAGE_URL')

  const autFocus = () => {
    document.getElementById('auto-focus-search').focus()
  }

  const qrCodeList = reactive({
    id: 0,
    order_id: 0,
    ticket_id: 0,
    order_name: '',
    order_gender: '',
    order_email: '',
    order_handphone: '',
    description: '',
    status: '',
    qr_path: {
        String: '',
        Valid: false
    },
    length: 0
  })
  const qrCodePayload = reactive({
    qr_value: ''
  })

  const searchByQrCode = () => {
    Order.searchQr(qrCodePayload)
    .then((res) => {
      let item = res.data
      for (const key in qrCodeList) {
        if (key == 'length') {
          continue
        }
        qrCodeList[key] = item.data[key]
      }

      qrCodeList.length = 1
    })
  }

  watch(qrCodePayload, (newQr) => {
    if (newQr.qr_value) {
      searchByQrCode()
    }
  })

  const clearQrList = (params) => {
    qrCodePayload.qr_value = ''
    for (const key in qrCodeList) {
      if (typeof qrCodeList[key] == 'string') {
        qrCodeList[key] = ''
      } else if (typeof qrCodeList[key] == 'bigint') {
        qrCodeList[key] = 0
      } else if (typeof qrCodeList[key] == 'number') {
        qrCodeList[key] = 0
      } else if (typeof qrCodeList[key] == 'boolean') {
        qrCodeList[key] = false
      }
    }

    // if (params.typeButton == 'clear-search') {
    //   qrCodePayload.qr_value = ''
    // }
  }

  const reactivTicket = () => {
    emits('reactivated', qrCodeList.order_id)
  }
</script>