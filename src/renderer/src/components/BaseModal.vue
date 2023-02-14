<template>
  <div class="modal fade" :id="modalId" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="orderedModalLabel" aria-hidden="true" style="padding: 0 !important;">
    <div class="modal-dialog" :class="sizing">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderedModalLabel">{{label}}</h5>
          <button v-show="sizing === 'modal-fullscreen'" @click="closeModal" type="button" class="btn-close fs-3 me-3"></button>
          <button v-show="sizing != 'modal-fullscreen'" @click="closeModal" type="button" class="btn btn-lg btn-icon btn-light"><i class="fs-1 fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer px-5">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps({
    modalId: {type: String, default: 'myModal'},
    label: String,
    sizing: {type: String, default: ''}
  })

  const emit = defineEmits(['clickEvent'])
  const closeModal = () => {
    emit('clickEvent', 'close')
  }
</script>