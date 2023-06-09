<template>
  <div class="container-fluid">
    <div class="card bg-cs-numpad p-3">
      <div class="row px-2">
        <input type="hidden" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue">
      </div>
      <div class="row">
        <div class="col-lg-12">
          <a @click="btnClicked('clear')" role="button" class="card p-3 text-center fs-3">
            CLEAR
          </a>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-lg-4">
          <a @click="btnClicked('1')" role="button" class="card p-3 text-center fs-3">
            1
          </a>
        </div>
        <div class="col-lg-4">
          <a @click="btnClicked('2')" role="button" class="card p-3 text-center fs-3">
            2
          </a>
        </div>
        <div class="col-lg-4">
          <a @click="btnClicked('3')" role="button" class="card p-3 text-center fs-3">
            3
          </a>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-lg-4">
          <a @click="btnClicked('4')" role="button" class="card p-3 text-center fs-3">
            4
          </a>
        </div>
        <div class="col-lg-4">
          <a @click="btnClicked('5')" role="button" class="card p-3 text-center fs-3">
            5
          </a>
        </div>
        <div class="col-lg-4">
          <a @click="btnClicked('6')" role="button" class="card p-3 text-center fs-3">
            6
          </a>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-lg-4">
          <a @click="btnClicked('7')" role="button" class="card p-3 text-center fs-3">
            7
          </a>
        </div>
        <div class="col-lg-4">
          <a @click="btnClicked('8')" role="button" class="card p-3 text-center fs-3">
            8
          </a>
        </div>
        <div class="col-lg-4">
          <a @click="btnClicked('9')" role="button" class="card p-3 text-center fs-3">
            9
          </a>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-lg-4">
          <a @click="btnClicked('0')" role="button" class="card p-3 text-center fs-3">
            0
          </a>
        </div>
        <div class="col-lg-4">
          <a @click="btnClicked('00')" role="button" class="card p-3 text-center fs-3">
            00
          </a>
        </div>
        <div class="col-lg-4">
          <a @click="btnClicked('del')" role="button" class="card bg-danger text-white p-3 text-center fs-3">
            Del
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  const emits = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: [String, Number],
  })

  const btnClicked = (params) => {
    if (params === 'clear') {
      emits('update:modelValue', '0')
    } else if (params === 'del'){
      if (props.modelValue.length == '1') {
        emits('update:modelValue', '0')
      } else {
        emits('update:modelValue', formatCurrency(props.modelValue.slice(0, -1)))
      }
    } else {
      if (props.modelValue == '0' && params != '00') {
        emits('update:modelValue', formatCurrency(params))
      } 
      else if (props.modelValue != '0') {
        emits('update:modelValue', formatCurrency(props.modelValue + params))
      }
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