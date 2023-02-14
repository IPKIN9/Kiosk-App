<template>
  <div :id="idInput.search" class="input-group input-group-merge">
    <span class="input-group-text"><i class="bx bx-search"></i></span>
    <input @click="getSearchWidth" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue"
    type="text" class="form-control form-control-lg" placeholder="Search..." aria-label="Search...">
  </div>
  <div style="position: absolute;
    z-index: 100;" v-show="selectShow" :id="idInput.select" class="mt-2">
    <select class="form-select" size="3">
      <option @click="sendEmits({ display: list[listConfigDisplay.display], value: list[listConfigDisplay.value] })"
        v-for="(list, index) in listSearch" :key="index" class="fs-3" :value="list[listConfigDisplay.value]">{{
          list[listConfigDisplay.display]
        }}</option>
    </select>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  listOfSelect: Object,
  listConfigDisplay: Object,
  modelValue: [String, Number],
  label: String,
  idInput: Object,
})

const emits = defineEmits(['eventClick', 'update:modelValue'])

const selectShow = ref(false)
const getSearchWidth = () => {
  let search = document.getElementById(props.idInput.search)
  let width = search.offsetWidth
  document.getElementById(props.idInput.select).style.width = `${width}px`

  selectShow.value = true
}

const sendEmits = (params) => {
  emits('eventClick', params)
  selectShow.value = false
}

const listSearch = computed(() => {
  return props.listOfSelect.filter((obj) => {
    const computedObj = { ...obj }
    return Object.keys(computedObj)
      .some(key => ('' + computedObj[key]).toLowerCase().includes(props.modelValue.toLowerCase()))
  })
})
</script>