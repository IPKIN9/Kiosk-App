<template>
  <div>
    <input type="text" v-currency class="form-control form-control-lg fs-3" placeholder="0"
    v-bind="$attrs" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue">
  </div>
</template>

<script setup>
  const props = defineProps({
    modelValue: [String, Number],
  })

  const emits = defineEmits(['update:modelValue'])

  const vCurrency = {
    beforeMount: (el) => {
      el.addEventListener('keyup', () => {
        el.value = formatCurrency(el.value)
      })
    }
  }

  function formatCurrency(value) {
    let input = value.replace(/[^0-9]/g, '')
    let result = ''
    while (input.length > 3) {
      result = '.' + input.slice(-3) + result
      input = input.slice(0, -3)
    }
    if (input) {
      result = input + result
    }
    return result
  }
</script>
