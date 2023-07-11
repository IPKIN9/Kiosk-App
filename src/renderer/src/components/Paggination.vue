<template>
  <nav v-if="getPageOf() > 1" aria-label="Page navigation mt-3">
    <ul class="pagination pagination-lg d-flex justify-content-center">
      <li class="page-item prev" :class="activated.front">
        <a @click.stop="sendEvent(1)" class="page-link" role="button"><i class="tf-icon bx bx-chevrons-left"></i></a>
      </li>
      <li class="page-item" :class="activated.prev">
        <a @click.stop="sendEvent(config.page - 1)"  class="page-link" role="button"><i class="tf-icon bx bx-chevron-left"></i></a>
      </li>
      <li v-for="(btn, index) in totalButton" :key="index" class="page-item" :class="(config.page === btn ? 'active' : '')">
        <a @click.stop="sendEvent(btn)" class="page-link" role="button">{{btn}}</a>
      </li>
      <li class="page-item" :class="activated.next">
        <a @click.stop="sendEvent(config.page + 1)" class="page-link" role="button"><i class="tf-icon bx bx-chevron-right"></i></a>
      </li>
      <li class="page-item next" :class="activated.end">
        <a @click.stop="sendEvent(getPageOf())" class="page-link" role="button"><i class="tf-icon bx bx-chevrons-right"></i></a>
      </li>
    </ul>
  </nav>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from 'vue';

  const props = defineProps({
    config: Object
  })

  const emits = defineEmits(['clickEvent'])

  const activated = reactive({
    front: 'disabled bg-white',
    end: 'disabled bg-white',
    next: 'disabled bg-white',
    prev: 'disabled bg-white',
  })

  const sendEvent = (params) => {
    emits('clickEvent', params)
    let page = props.config.page
    let first = configButton.firstButton
    let end = configButton.endButton

    if (page > end && page != getPageOf()) {
      configButton.firstButton += 1
      configButton.endButton += 1
    } else if (page < (first + 1) && page != 1) {
      configButton.firstButton -= 1
      configButton.endButton -= 1
    } else if (page === getPageOf()) {
      configButton.firstButton = getPageOf() - 3
      configButton.endButton = getPageOf()
    } else if (page === 1) {
      configButton.firstButton = 0
      configButton.endButton = 3
    }
  }

  const visibleButton = () => {
    let page = props.config.page
    let pageOf = getPageOf()
    
    if (page != 0 && page < pageOf && page === 1) {
      activated.next = ''
      activated.end = ''
      activated.prev = 'disabled bg-white'
      activated.front = 'disabled bg-white'
    } else if (page != 0 && page < pageOf && page > 1) {
      activated.next = ''
      activated.end = ''
      activated.prev = ''
      activated.front = ''
    } else if (page != 0 && page > 1 && page <= pageOf) {
      activated.next = 'disabled bg-white'
      activated.end = 'disabled bg-white'
      activated.prev = ''
      activated.front = ''
    }
  }

  watch(props.config, (newProps) => {
    if (newProps.total || newProps.limit || newProps.page) {
      visibleButton()
    }
  })

  const getPageOf = () => {
    let proc = Math.ceil(props.config.total / props.config.limit)
    return proc
  }

  const configButton = reactive({
    firstButton: 0,
    endButton: 3
  })

  const totalButton = computed(() => {
    let proc = getPageOf()
    let count = []

    if (props.config.page === 1) {
      configButton.firstButton = 0
      configButton.endButton = 3
    }

    for (let index = configButton.firstButton; index < proc && index < configButton.endButton; index++) {
      if (index != -1) {
        count.push(index + 1)
      }
    }
    return count
  })

  onMounted(() => {
    visibleButton()
  })
</script>