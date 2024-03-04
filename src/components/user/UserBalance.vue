<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { useUserStore } from '@/store/user'
import { computed, onMounted, ref } from 'vue'
const userStore = useUserStore()
const isLoading = ref(true)
console.log(userStore)
const balance = computed(() => userStore.balance || {})
onMounted(() => {
  isLoading.value = true
  //FETCH USER INFO HERE IF didn't have before
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
      <div class="flex flex-col">
        <div class="text-zinc-400 text-xs">Total balance (USD)</div>
        <div class="text-zinc-500 mt-1 text-2xl">
          <span class="text-zinc-100 font-bold">${{ balance.usd.toFixed(2) }}</span>
        </div>
        <div class="text-zinc-400 text-sm">= {{ balance.btc }} BTC</div>
      </div>
    </template>
  </Card>
</template>
