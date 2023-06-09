<template>
  <div :id="idInput.search" class="input-group input-group-merge">
    <span class="input-group-text"><i class="bx bx-search"></i></span>
    <input @keyup="sendSearchEmits" @click="getSearchWidth" @input="$emit('update:modelValue', $event.target.value)"
      :value="modelValue" type="text" class="form-control form-control-lg" placeholder="Search..."
      aria-label="Search..." />
  </div>
  <div style="position: absolute; z-index: 100" v-show="listOfSelect.length >= 1" :id="idInput.select" class="mt-2">
    <select class="form-select" size="3">
      <option @click="
        sendEmits(index)
      " v-for="(list, index) in listOfSelect" :key="index" class="fs-3" :value="list[listConfigDisplay.value]">
        {{ list[listConfigDisplay.display] }}
      </option>
    </select>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
  listOfSelect: Object,
  listConfigDisplay: Object,
  modelValue: [String, Number],
  label: String,
  idInput: Object,
});

const emits = defineEmits(["eventClick", "searchEvent", "update:modelValue"]);

const selectShow = ref(false)
const getSearchWidth = () => {
  let search = document.getElementById(props.idInput.search)
  let width = search.offsetWidth
  document.getElementById(props.idInput.select).style.width = `${width}px`
}

const sendSearchEmits = () => {
  emits("searchEvent");
};

const sendEmits = (params) => {
  emits('eventClick', params)
}
</script>
