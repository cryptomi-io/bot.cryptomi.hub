<script setup>
import navigation from '@/data/navigation.json'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoutePath = computed(() => route.path)
const currentRoute = computed(() => recursiveSearch(navigation, currentRoutePath.value))

const children = computed(() => {
  let children = null
  if (currentRoute.value?.children) {
    children = currentRoute.value?.children
  } else if (currentRoute.value?.parent) {
    children = recursiveSearch(navigation, currentRoute.value.parent)?.children
  }

  return children
})

function recursiveSearch(array, targetName) {
  for (let item of array) {
    if (item.path === targetName) {
      return item
    } else if (item.children) {
      let result = recursiveSearch(item.children, targetName)
      if (result) {
        return result
      }
    }
  }
  return null
}
</script>

<template>
  <div
    class="fixed backdrop-blur-md z-50 w-11/12 h-16 max-w-lg -translate-x-1/2 bg-white/70 rounded-full bottom-4 left-1/2 dark:bg-neutral-800/70 dark:border-gray-600"
  >
    <div class="grid h-full max-w-lg grid-cols-5 mx-auto overflow-hidden">
      <div
        v-for="(item, i) in children?.length ? children : navigation"
        :key="i"
        :class="[
          i === 0 ? 'rounded-s-full' : '',
          navigation.length - 1 === i ? 'rounded-e-full' : '',
          'inline-flex flex-col items-center justify-center px-5 group ',
          currentRoutePath === item.path
            ? 'dark:text-white text-zinc-950'
            : 'text-gray-600 dark:text-gray-400'
        ]"
      >
        <router-link
          :to="item.path"
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 group"
        >
          <Icon :icon="item.icon" class="h-5 w-5 mb-1" />

          <span class="text-[10px]">
            {{ item.name }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>
