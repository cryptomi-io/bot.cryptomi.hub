<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useAnalytics } from '@/composables/useAnalytics'
import { useHelper } from '@/utils/helper'
import { ref } from 'vue'

const { getPnLAnalyticsByEtherscan } = useAnalytics()
const { numberFormat } = useHelper()

const isLoading = ref(false)
const progressWidth = ref(0)
const tab = ref('profit')
const formData = ref({
  wallet: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
  timePeriod: 30
})
const periods = [1, 7, 30, 60, 90]
const topTokens = ref([])
const loseTokens = ref([])

const formHandleSubmit = async () => {
  isLoading.value = true
  if (!formData.value.wallet) {
    toast('Please enter the wallet', {
      autoClose: 3000,
      type: 'warning',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    }) // ToastOptions
    isLoading.value = false
    progressWidth.value = 100
    return
  }
  progressWidth.value = 30
  const result = await getPnLAnalyticsByEtherscan(formData.value.wallet, formData.value.timePeriod)
  if (!result.length) {
    toast('PnL is not calculated for this account', {
      autoClose: 3000,
      type: 'warning',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    }) // ToastOptions
    progressWidth.value = 100
    isLoading.value = false
    return
  }
  topTokens.value = result
    .filter((token) => token.PnL > 0 || token.unrealizedPnL > 0)
    .sort((a, b) => b.PnL - a.PnL || b.unrealizedPnL - a.unrealizedPnL)
    .slice(0, 5)
  loseTokens.value = result
    .filter((token) => token.PnL < 0 || token.unrealizedPnL < 0)
    .sort((a, b) => b.PnL - a.PnL || b.unrealizedPnL - a.unrealizedPnL)
    .slice(0, 5)
  isLoading.value = false
}
</script>

<template>
  <div v-if="isLoading" class="progress-bar fixed top-0 left-0 h-1 w-full bg-zinc-900">
    <div
      class="h-1 bg-green-400 transition-all duration-600"
      :style="{ width: progressWidth + '%' }"
    ></div>
  </div>
  <div class="flex flex-col gap-3">
    <form class="flex flex-col gap-4" @submit.prevent="formHandleSubmit">
      <div class="flex flex-col gap-2">
        <label>Choose time period</label>
        <div class="flex w-full gap-2">
          <div
            v-for="timePeriod in periods"
            @click="formData.timePeriod = timePeriod"
            :key="timePeriod"
            :class="[
              'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
              timePeriod === formData.timePeriod
                ? 'bg-green-500 text-zinc-900'
                : 'bg-zinc-900 text-zinc-400'
            ]"
          >
            {{ timePeriod }}d
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label>Enter user wallet</label>
        <input
          v-model="formData.wallet"
          type="text"
          placeholder="0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
        />
      </div>

      <Button text="Check wallet" type="primary" class="!w-full mt-2" :isLoading="isLoading" />
    </form>
    <template v-if="topTokens.length || loseTokens.length">
      <div class="flex w-full gap-2 mt-4">
        <div
          v-if="topTokens.length"
          @click="tab = 'profit'"
          :class="[
            'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
            tab === 'profit' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
          ]"
        >
          Top 3 by profit
        </div>
        <div
          v-if="loseTokens.length"
          @click="tab = 'lose'"
          :class="[
            'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
            tab === 'lose' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
          ]"
        >
          Top 3 by losses
        </div>
      </div>
      <template v-if="tab === 'profit' && topTokens.length">
        <Card
          v-for="(token, i) in topTokens"
          :key="i"
          class="py-3 px-5 flex-col text-start !items-start gap-2"
        >
          <div>
            <div class="text-md font-bold">{{ token.symbol }}</div>
            <div class="text-xs text-zinc-400 font-light">{{ token.contractAddress }}</div>
          </div>
          <div class="flex flex-col">
            <div class="text-xs text-zinc-400">Buy</div>
            <div class="text-sm text-green-400 font-bold">
              <span v-html="numberFormat(token.totalBuy)"></span>$
            </div>
          </div>
          <div class="flex gap-2 w-full">
            <div class="flex flex-col w-full">
              <div class="text-xs text-zinc-400">Total sell</div>
              <div class="text-xs text-zinc-100">
                <span v-html="numberFormat(token.totalSell)"></span>$
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div class="text-xs text-zinc-400">Real PnL</div>
              <div class="text-xs text-zinc-100">
                <span v-html="numberFormat(token.PnL)"></span>$
                {{
                  token.PnLPercent !== 0 && token.PnLPercent < 0.01 ? '<0.01' : token.PnLPercent
                }}%
              </div>
            </div>
            <div class="flex flex-col w-full item-end text-right">
              <div class="text-xs text-zinc-400">Unrelized PnL</div>
              <div class="text-xs text-zinc-100">
                <span v-html="numberFormat(token.unrealizedPnL)"></span>$ |
                {{
                  token.unrealizedPnLPercent !== 0 && token.unrealizedPnLPercent < 0.01
                    ? '<0.01'
                    : token.unrealizedPnLPercent
                }}%
              </div>
            </div>
          </div>
        </Card>
      </template>
      <template v-if="tab === 'lose' && loseTokens.length">
        <Card
          v-for="(token, i) in loseTokens"
          :key="i"
          class="py-3 px-5 flex-col text-start !items-start gap-2"
        >
          <div>
            <div class="text-md font-bold">{{ token.symbol }}</div>
            <div class="text-xs text-zinc-400 font-light">{{ token.contractAddress }}</div>
          </div>
          <div class="flex flex-col">
            <div class="text-xs text-zinc-400">Buy</div>
            <div class="text-sm text-green-400 font-bold">
              <span v-html="numberFormat(token.totalBuy)"></span>$
            </div>
          </div>
          <div class="flex gap-2 w-full">
            <div class="flex flex-col w-full">
              <div class="text-xs text-zinc-400">Total sell</div>
              <div class="text-xs text-zinc-100">
                <span v-html="numberFormat(token.totalSell)"></span>$
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div class="text-xs text-zinc-400">Real PnL</div>
              <div class="text-xs text-zinc-100">
                <span v-html="numberFormat(token.PnL)"></span>$
                {{
                  token.PnLPercent !== 0 && token.PnLPercent < 0.01 ? '<0.01' : token.PnLPercent
                }}%
              </div>
            </div>
            <div class="flex flex-col w-full item-end text-right">
              <div class="text-xs text-zinc-400">Unrelized PnL</div>
              <div class="text-xs text-zinc-100">
                <span v-html="numberFormat(token.unrealizedPnL)"></span>$ |
                {{
                  token.unrealizedPnLPercent !== 0 && token.unrealizedPnLPercent < 0.01
                    ? '<0.01'
                    : token.unrealizedPnLPercent
                }}%
              </div>
            </div>
          </div>
        </Card>
      </template>
    </template>
  </div>
</template>
@/services/etherscan
../../composables/useAnalytics../../utils/helper