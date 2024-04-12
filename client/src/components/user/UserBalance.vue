<script setup>
import Card from '@/components/ui/Card.vue'
import { useHelper } from '@/utils/helper'
import { useUserStore } from '@/store/user'
import { computed, onMounted, ref } from 'vue'
import { usePresale } from '@/composables/usePresale'

const { numberFormat } = useHelper()
const presale = usePresale()
const userStore = useUserStore()
const isLoading = ref(true)
const profile = computed(() => userStore.profile || {})
const ctmi = {
  icon: '/images/assets/ctmi.png'
}
const ctmiRate = ref(null)
onMounted(async () => {
  isLoading.value = true
  //FETCH USER INFO HERE IF didn't have before
  ctmiRate.value = await presale.getRate()
  userStore.fetchProfile()
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
<template>
  <Card class="py-3 px-4">
    <template v-if="isLoading">
      <div class="flex flex-col">
        <div class="h-2 bg-neutral-700 rounded w-[110px]"></div>
        <div class="h-6 mt-2 bg-neutral-700 rounded w-[130px]"></div>
        <div class="h-3 mt-2 bg-neutral-700 rounded w-[90px]"></div>
      </div>
      <div class="h-7 bg-neutral-700 rounded-2xl w-[80px]"></div>
    </template>
    <template v-else>
      <div class="flex gap-2 items-center">
        <img
          :src="ctmi?.icon ? ctmi?.icon : 'http://placeholder.co/300x300'"
          alt="placeholder"
          class="w-10 h-10 rounded-full"
        />
        <div class="flex flex-col">
          <div class="text-zinc-100 font-bold text-sm">$CTMI</div>
          <div class="text-zinc-400 text-xs">{{ profile?.ctmi }} CTMI</div>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <router-link
          v-if="!profile?.ctmi"
          to="/sale"
          class="rounded-2xl px-5 py-2 inline-flex font-medium cursor-pointer text-center justify-center bg-green-500 text-zinc-100 text-md"
        >
          Buy
        </router-link>
        <div v-if="profile?.ctmi && ctmiRate?.price" class="flex flex-col items-end text-zinc-100">
          <span v-html="numberFormat(ctmiRate.price) + `$`" class="font-bold"></span>
          <span class="text-xs" v-if="ctmiRate?.diff" :class="[ctmiRate?.diff > 0 ? 'text-green-500' : 'text-red-500']">
            {{ ctmiRate?.diff > 0 ? '+' : '-' }}{{ ctmiRate?.diff?.toFixed(2) }}%
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>
