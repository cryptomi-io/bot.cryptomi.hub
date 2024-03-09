<script setup>
import Card from '@/components/ui/Card.vue'
import { useBotAnalyzerStore } from '@/store/bots/analyzer'
import { useHelper } from '@/utils/helper'
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BackButton } from 'vue-tg'
import { toast } from 'vue3-toastify'

import 'vue3-toastify/dist/index.css'

const { numberFormat } = useHelper()
const botAnalyzerStore = useBotAnalyzerStore()
const router = useRouter()
const route = useRoute()
const { wallet, timePeriod } = route.params
if (!wallet || !timePeriod) {
  toast('Wallet or time period not found', {
    autoClose: 3000,
    type: 'warning',
    position: 'top-right',
    theme: 'dark',
    toastStyle: 'top:10px'
  }) // ToastOptions
  router.back()
}
//Refs
const tab = ref('profit')

const topTokens = computed(() =>
  botAnalyzerStore.analyze
    .filter((token) => token.PnL > 0 || token.unrealizedPnL > 0)
    .sort((a, b) => b.PnL - a.PnL || b.unrealizedPnL - a.unrealizedPnL)
    .slice(0, 5)
)
const loseTokens = computed(() =>
  botAnalyzerStore.analyze
    .filter((token) => token.PnL < 0 || token.unrealizedPnL < 0)
    .sort((a, b) => b.PnL - a.PnL || b.unrealizedPnL - a.unrealizedPnL)
    .slice(0, 5)
)

const generalWin = computed(() =>
  botAnalyzerStore.analyze.reduce((acc, token) => (token.PnL > 0 ? acc + token.PnLPercent : 0), 0)
)
const generalPnL = computed(() =>
  botAnalyzerStore.analyze.reduce((acc, token) => acc + token.PnL, 0)
)
const generalPnLPercent = computed(() =>
  botAnalyzerStore.analyze.reduce((acc, token) => acc + token.PnLPercent, 0)
)
const generalUnrealizedPnL = computed(() =>
  botAnalyzerStore.analyze.reduce((acc, token) => acc + token.unrealizedPnL, 0)
)
const generalUnrealizedPnLPercent = computed(() =>
  botAnalyzerStore.analyze.reduce((acc, token) => acc + token.unrealizedPnLPercent, 0)
)
onMounted(async () => {
  if (
    botAnalyzerStore.wallet !== wallet ||
    botAnalyzerStore.timePeriod !== +timePeriod ||
    botAnalyzerStore.analyze.length === 0
  ) {
    router.back()
  }
})

onBeforeUnmount(() => {
  botAnalyzerStore.resetData()
})

function handleBackButton() {
  router.back()
}
</script>

<template>
  <BackButton @click="handleBackButton" />
  <div class="flex flex-col gap-3">
    <Card class="py-3 px-5 flex-col text-start !items-start gap-2">
      <div class="text-md font-bold">Wallet analytics</div>
      <div>
        <div class="text-xs text-zinc-400 font-light">Address</div>
        <div class="text-sm text-wrap break-all">{{ wallet }}</div>
      </div>
      <div>
        <div class="text-xs text-zinc-400 font-light">General statistics</div>
        <div class="flex gap-1 items-center text-sm">
          <Icon icon="ph:scales" class="w-4 h-4" />
          <span>Win rate: {{ generalWin.toFixed(2) }}%</span>
        </div>
        <div class="flex gap-1 items-center text-sm">
          <Icon icon="solar:dollar-broken" class="w-4 h-4" />
          <span>
            PnL: <span v-html="numberFormat(generalPnL)"></span>$ |
            {{
              generalPnLPercent !== 0 && generalPnLPercent < 0.01 && generalPnLPercent > -0.01
                ? '<0.01'
                : generalPnLPercent.toFixed(2)
            }}%
          </span>
        </div>
        <div class="flex gap-1 items-center text-sm">
          <Icon icon="grommet-icons:line-chart" class="w-4 h-4" />
          <span>
            Unrealized PnL: <span v-html="numberFormat(generalUnrealizedPnL)"></span>$ |
            {{
              generalUnrealizedPnLPercent !== 0 &&
              generalUnrealizedPnLPercent < 0.01 &&
              generalUnrealizedPnLPercent > -0.01
                ? '<0.01'
                : generalUnrealizedPnLPercent.toFixed(2)
            }}%
          </span>
        </div>
      </div>
    </Card>
    <template v-if="topTokens.length || loseTokens.length">
      <div class="flex w-full gap-2 mt-4">
        <div
          @click="tab = 'profit'"
          :class="[
            'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
            tab === 'profit' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
          ]"
        >
          Top 3 by profit
        </div>
        <div
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
                <span v-html="numberFormat(token.PnL)"></span>$ |
                {{
                  token.PnLPercent !== 0 && token.PnLPercent < 0.01 && token.PnLPercent > -0.01
                    ? '<0.01'
                    : token.PnLPercent.toFixed(2)
                }}%
              </div>
            </div>
            <div class="flex flex-col w-full item-end text-right">
              <div class="text-xs text-zinc-400">Unrelized PnL</div>
              <div class="text-xs text-zinc-100">
                <span v-html="numberFormat(token.unrealizedPnL)"></span>$ |
                {{
                  token.unrealizedPnLPercent !== 0 &&
                  token.unrealizedPnLPercent < 0.01 &&
                  token.unrealizedPnLPercent > -0.01
                    ? '<0.01'
                    : token.unrealizedPnLPercent.toFixed(2)
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
                  token.PnLPercent !== 0 && token.PnLPercent < 0.01 && token.PnLPercent > -0.01
                    ? '<0.01'
                    : token.PnLPercent.toFixed(2)
                }}%
              </div>
            </div>
            <div class="flex flex-col w-full item-end text-right">
              <div class="text-xs text-zinc-400">Unrelized PnL</div>
              <div class="text-xs text-zinc-100">
                <span v-html="numberFormat(token.unrealizedPnL)"></span>$ |
                {{
                  token.unrealizedPnLPercent !== 0 &&
                  token.unrealizedPnLPercent < 0.01 &&
                  token.unrealizedPnLPercent > -0.01
                    ? '<0.01'
                    : token.unrealizedPnLPercent.toFixed(2)
                }}%
              </div>
            </div>
          </div>
        </Card>
      </template>
    </template>
  </div>
</template>
