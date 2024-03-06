<script setup>
import Menu from '@/components/ui/Menu.vue'
import { GUEST_ROUTES } from '@/data/routes'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWebAppViewport } from 'vue-tg'
const { expand } = useWebAppViewport()
const route = useRoute()

expand()

const isGuest = computed(() => {
  return GUEST_ROUTES.find((item) => item.path === route.path)
})
</script>

<template>
  <main class="p-3 pb-[90px] min-h-screen bg-neutral-950 text-gray-500 dark:text-gray-200">
    <div class="flex flex-col justify-between h-full">
      <Menu v-if="!isGuest" />
      <router-view></router-view>
    </div>
  </main>
</template>
