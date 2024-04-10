<script setup>
import Menu from '@/components/ui/Menu.vue'
import UserShortInfo from '@/components/user/UserShortInfo.vue'
import MarketMarquee from '@/components/markets/MarketMarquee.vue'

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
const isHome = computed(() => {
  return route.path === '/'
})
</script>

<template>
  <main class="p-3 pb-[90px] min-h-screen bg-[#0f0f0f] text-gray-500">
    <div class="flex flex-col justify-between h-full">
      <div :class="isHome ? 'pt-10' : ''">
        <MarketMarquee v-if="isHome" class="fixed top-0 left-0 z-10" />
        <div class="flex flex-col gap-3">
          <UserShortInfo />
          <router-view></router-view>
        </div>
      </div>

      <Menu v-if="!isGuest" />
    </div>
  </main>
</template>
