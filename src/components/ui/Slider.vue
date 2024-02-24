<script setup>
import { onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: []
  },
  classes: {
    type: String,
    default: ''
  }
})

const currentIndex = ref(0)
let autoScrollInterval

const startAutoScroll = () => {
  autoScrollInterval = setInterval(() => {
    nextImage()
  }, 8000) // Change image every 3 seconds
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

startAutoScroll()

onBeforeUnmount(() => {
  clearInterval(autoScrollInterval) // Clear the interval when the component is unmounted
})
</script>

<template>
  <div :class="props.classes">
    <transition name="fade">
      <img
        :key="currentIndex"
        :src="images[currentIndex]"
        alt="Slider Image"
        class="w-full h-full object-cover object-center"
      />
    </transition>
  </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
