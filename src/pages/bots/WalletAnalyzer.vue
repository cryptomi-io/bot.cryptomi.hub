<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import axios from 'axios'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { useEtherscan } from '@/composables/useEtherscan'
import { ref } from 'vue'

const { getAnalytics } = useEtherscan()

const formData = ref({
  wallet: '',
  timePeriod: 1
})
const periods = [1, 7, 30, 60, 90]
const topTokens = ref([])
const loseTokens = ref([])

const formHandleSubmit = async () => {
  if (!formData.value.wallet) {
    toast('Please enter the wallet', {
      autoClose: 3000,
      type: 'error',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    }) // ToastOptions
    return
  }
  try {
    const result = await getAnalytics(formData.value.wallet, formData.value.timePeriod)
    topTokens.value = result
      .filter((token) => token.PnL > 0)
      .sort((a, b) => b.PnL - a.PnL)
      .slice(0, 5)
    loseTokens.value = result
      .filter((token) => token.PnL < 0)
      .sort((a, b) => b.PnL - a.PnL)
      .slice(0, 5)
  } catch (error) {
    toast('Something went wrong', {
      autoClose: 3000,
      type: 'error',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    })
  }
}
const formHandleSubmitV2 = async () => {
  try {
    const response = await axios.post('http://localhost:3005/api/analyze', {
      address: formData.value.wallet,
      timePeriod: formData.value.timePeriod
    })
  } catch (error) {
    toast('Something went wrong', {
      autoClose: 3000,
      type: 'error',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    })
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <form class="flex flex-col gap-5" @submit.prevent="formHandleSubmit">
      <label>Choose time period</label>
      <div class="flex w-full rounded-2xl overflow-hidden">
        <div
          v-for="timePeriod in periods"
          @click="formData.timePeriod = timePeriod"
          :key="timePeriod"
          :class="[
            'w-full  p-3 text-sm text-center cursor-pointer',
            timePeriod === formData.timePeriod
              ? 'bg-green-500 text-zinc-900'
              : 'bg-zinc-900 text-zinc-400'
          ]"
        >
          {{ timePeriod }}d
        </div>
      </div>
      <label>Enter user wallet</label>
      <input
        v-model="formData.wallet"
        type="text"
        placeholder="0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b"
        class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
      />
      <Button text="Check wallet" type="primary" class="!w-full mt-2" />
    </form>
    <Card v-if="topTokens.length" class="py-3 px-4 flex-col text-start !items-start gap-3">
      <div class="text-lg font-bold">Top Tokens</div>
      <div v-for="token in topTokens" :key="token.name" class="w-full mb-5">
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Symbol</span>
          <span class="text-white">{{ token.symbol }}</span>
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Transactions count</span>
          <span class="text-white">{{ token.transactions.length }}</span>
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">PnL</span>
          <span class="text-white">
            {{ token.PnL.toFixed(8) }} ({{ token.PnLPercent.toFixed(2) }}%)
          </span>
        </div>
      </div>
    </Card>
    <Card v-if="loseTokens.length" class="py-3 px-4 flex-col !items-start gap-3">
      <div class="text-lg font-bold">Lose Tokens</div>
      <div v-for="token in loseTokens" :key="token.name" class="w-full mb-5">
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Symbol</span>
          <span class="text-white">{{ token.symbol }}</span>
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Transactions count</span>
          <span class="text-white">{{ token.transactions.length }}</span>
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">PnL</span>
          <span class="text-white">
            {{ token.PnL.toFixed(8) }} ({{ token.PnLPercent.toFixed(2) }}%)
          </span>
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Unrelized PnL</span>
          <span class="text-white">
            {{ token.unrealizedPnL.toFixed(8) }} ({{ token.PnLPercent.toFixed(2) }}%)
          </span>
        </div>
      </div>
    </Card>
  </div>
</template>
@/services/etherscan
