<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Click me'
  },
  type: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  clickHandler: Function
})
const buttonText = ref(props.text)

const classes = {
  primary: 'bg-green-500 hover:bg-green-600  text-zinc-900',
  secondary: ''
}
const sizes = {
  sm: 'text-sm py-1 px-3',
  md: 'text-md',
  lg: 'text-lg py-3 px-5'
}
const handleClick = () => {
  if (props.clickHandler) {
    props.clickHandler()
  }
}
</script>
<template>
  <button
    :class="[
      'rounded-2xl px-5 py-2 inline-flex cursor-pointer w-auto text-center justify-center',
      classes[type],
      sizes[size]
    ]"
    @click="handleClick"
  >
    {{ buttonText }}
  </button>
</template>
