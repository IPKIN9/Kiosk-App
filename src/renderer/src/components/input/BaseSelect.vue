<template>
  <select class="form-select form-select-lg" v-bind="$attrs" @input="$emit('update:modelValue', $event.target.value)"
    :value="modelValue">
    <option class="fs-3" value="0" disabled>-- Select --</option>
    <option class="fs-3 text-capitalize" v-for="opt in optionList" :value="opt[displayList.value]">{{ opt[displayList.display] }}</option>
  </select>
</template>
<script setup>
const props = defineProps({
  label: String,
  optionList: Object,
  displayList: Object,
  modelValue: [String, Number],
})
const emits = defineEmits(['changeEvent', 'update:modelValue'])
</script>