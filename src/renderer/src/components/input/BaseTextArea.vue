<template>
	<label class="form-label">{{ label }}</label>
	<textarea class="form-control" v-bind="$attrs" @input="$emit('update:modelValue', $event.target.value)"
		:value="modelValue"></textarea>
</template>
<script setup>
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
	label: String,
	modelValue: [Number, String]
})
</script>