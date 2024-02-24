<script setup>
import Menu from '@/components/ui/Menu.vue'
import { GUEST_ROUTES } from '@/data/routes'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const isGuest = computed(() => {
  return GUEST_ROUTES.find((item) => item.path === route.path)
})
</script>

<template>
  <main class="p-3 pb-[90px] min-h-screen bg-neutral-950 text-gray-500 dark:text-gray-200">
    <Menu v-if="!isGuest" />
    <router-view></router-view>
  </main>
</template>
