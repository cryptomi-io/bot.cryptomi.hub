<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

import { useEtherscan } from '@/services/analyzer/etherscan'

import { notify } from 'notiwind'
import { ref } from 'vue'

const { getAnalytics } = useEtherscan()

const formData = ref({
  wallet: '',
  timePeriod: 30
})
const periods = [30, 60, 120]
const topTokens = ref([])
const loseTokens = ref([])

const formHandleSubmit = async () => {
  if (!formData.value.wallet) {
    notify(
      {
        group: 'foo',
        title: 'Error',
        text: 'Please enter the wallet'
      },
      4000
    ) // 3s
    return
  }
  const result = await getAnalytics(formData.value.wallet, formData.value.timePeriod)
  topTokens.value = result.topTokens
  loseTokens.value = result.loseTokens
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
        required
        placeholder="0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b"
        class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm"
      />
      <Button text="Sign Up" type="primary" class="!w-full mt-2" />
    </form>
    <div class="text-xs text-zinc-400">Powered by CRYPTOMI</div>
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
          <span class="text-zinc-300">Total sell</span>
          <span class="text-white"
            >{{ token.totalSellValue }} ({{ token.totalSellPrice.toFixed(2) }}USDT)</span
          >
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Total buy</span>
          <span class="text-white"
            >{{ token.totalBuyValue }} ({{ token.totalBuyPrice.toFixed(2) }}USDT)</span
          >
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">PnL</span>
          <span class="text-white">
            {{ token.pnl_value }} ({{ token.pnl_percent.toFixed(2) }}%)
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
          <span class="text-zinc-300">Total sell</span>
          <span class="text-white"
            >{{ token.totalSellValue }} ({{ token.totalSellPrice.toFixed(2) }}USDT)</span
          >
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Total buy</span>
          <span class="text-white">{{ token.totalBuyValue }} ({{ token.totalBuyPrice }}USDT)</span>
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">PnL</span>
          <span class="text-white">
            {{ token.pnl_value }} ({{ token.pnl_percent.toFixed(2) }}%)
          </span>
        </div>
      </div>
    </Card>
  </div>
</template>
