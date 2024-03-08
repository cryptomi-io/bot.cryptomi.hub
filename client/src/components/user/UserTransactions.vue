<script setup>
import Card from '@/components/ui/Card.vue'

import { useTransactionsStore } from '@/store/transactions'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
const transactionsStore = useTransactionsStore()
const transactions = computed(() => transactionsStore.list || {})

const isLoading = ref(false)

onMounted(() => {
  isLoading.value = true
  transactionsStore.fetchTransactions()
  //FETCH USER INFO HERE IF didn't have before
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold text-lg">Last transactions</div>
    <div class="flex flex-col gap-1">
      <!-- Pleholder -->
      <template v-if="isLoading">
        <Card v-for="i in 5" :key="i" class="py-3 px-4">
          <div class="flex gap-2 items-center">
            <div class="flex flex-col animate-pulse">
              <div class="h-4 bg-neutral-700 rounded w-20"></div>
              <div class="h-2 bg-neutral-700 mt-1 rounded w-12"></div>
            </div>
          </div>
          <div class="flex flex-col items-end animate-pulse">
            <div class="h-4 bg-neutral-700 rounded w-20"></div>
            <div class="h-2 bg-neutral-700 mt-1 rounded w-10"></div>
          </div>
        </Card>
      </template>
      <template v-else>
        <Card v-for="(item, i) in transactions" :key="i" class="py-3 px-4 text-xs">
          <div class="flex gap-2 items-center">
            <div
              :class="`rounded-md border p-1 ${item?.side === 'BUY' ? 'border-green-500' : 'border-red-500'}`"
            >
              <Icon
                :icon="`pepicons-print:arrow-${item?.side === 'BUY' ? 'up' : 'down'}-right`"
                :class="`h-5 w-5 ${item?.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-zinc-100">
                {{ item?.side === 'BUY' ? 'Buy' : 'Sell' }} {{ item?.currency }}
              </div>
              <div class="text-zinc-400">09.09.2024</div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="text-zinc-100">{{ item?.amount }}</div>
            <span class="text-zinc-400">{{ item?.cost }} USD</span>
          </div>
        </Card>
        <Card class="bg-neutral-700 py-2 px-4">
          <div
            class="flex gap-2 items-center font-medium text-sm text-center justify-center cursor-pointer m-auto"
          >
            Other
          </div>
        </Card>
      </template>
    </div>
  </div>
</template>
../../store/transactions