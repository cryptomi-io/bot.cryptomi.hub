<script setup>
const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div
    :class="['flex bg-neutral-800 rounded-xl items-center justify-between', props.class]"
  >
    <slot />
  </div>
</template>
