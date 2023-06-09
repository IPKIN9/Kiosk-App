<template>
  <label class="form-label">{{label}}</label>
  <span v-if="isRequired" class="ms-1 form-text text-danger">*</span>
  <input class="form-control" v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)" :value="modelValue"
    :type="typeOf">
</template>
<script setup>
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  label: String,
  typeOf: {type: String, default: 'text'},
  isRequired: {type: Boolean, default: false},
  modelValue: [String, Number],
})
</script>