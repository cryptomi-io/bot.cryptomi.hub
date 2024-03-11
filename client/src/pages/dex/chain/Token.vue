<script setup>
import Card from '@/components/ui/Card.vue'
import Loader from '@/components/ui/Loader.vue'
import { useDextools } from '@/composables/useDextools'
import { useHelper } from '@/utils/helper'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWebAppNavigation } from 'vue-tg'
import { toast } from 'vue3-toastify'

const { openLink } = useWebAppNavigation()
const { capitalizeFirstLetter, numberFormat, shortenContractAddress, delay } = useHelper()
const router = useRouter()
const {
  getTokenPriceByAddress,
  getTokenLockInfoByAddress,
  getTokenAdditInfoByAddress,
  getTokenInfoFromDbByAddress
} = useDextools()

const props = defineProps({
  chain: String,
  address: String
})
const isLoading = ref(true)
const isOpenSocials = ref(false)
const token = ref({
  info: {},
  lock: {},
  audit: {},
  additional: {},
  price: {}
})
const calcToken = ref(0)
const calcUSD = ref(0)

const socialInfo = computed(() => {
  if (token.value?.info?.socialInfo) {
    return Object.entries(token.value?.info?.socialInfo).filter(([key, value]) => {
      return key !== 'website' && key !== 'twitter' && value !== ''
    })
  } else {
    return []
  }
})
onMounted(async () => {
  const tokenInfo = await getTokenInfoFromDbByAddress(props.chain, props.address)
  if (!tokenInfo) {
    router.back()
    return
  }
  console.log(tokenInfo)
  token.value.info = tokenInfo
  token.value.audit = tokenInfo.additional_info.audit
  token.value.exchange = tokenInfo.exchange
  
  token.value.additional = await getTokenAdditInfoByAddress(props.chain, props.address)
  delay(1000)
  token.value.lock = await getTokenLockInfoByAddress(props.chain, props.address)
  delay(1000)
  token.value.price = await getTokenPriceByAddress(props.chain, props.address)

  isLoading.value = false
})
const copy = (text) => {
  navigator.clipboard.writeText(text)
  toast('Copied to clipboard', {
    autoClose: 1000,
    type: 'success',
    position: 'top-right',
    theme: 'dark',
    toastStyle: 'top:10px'
  })
}
watch(calcToken, (newValue) => {
  calcUSD.value = newValue * token.value.price.price
})
watch(calcUSD, (newValue) => {
  calcToken.value = newValue / token.value.price.price
})
</script>

<template>
  {{ console.log(token)}}
  <Loader v-if="isLoading" />

  <div v-else class="flex flex-col gap-3">
    <template v-if="isLoading">
      <div class="flex items-center gap-4 w-full">
        <div class="rounded-full animate-pulse bg-neutral-700 h-10 w-10"></div>
        <div class="flex flex-col animate-pulse">
          <div class="h-4 bg-neutral-700 rounded w-20"></div>
          <div class="h-2 bg-neutral-700 mt-1 rounded w-12"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col gap-3 w-full">
        <!-- --------TOKEN INFO------ -->
        <div class="flex items-center gap-4">
          <div class="relative inline-block">
            <img
                  class="inline-block w-12 h-12 rounded-full border-2"
                  :src="`${token?.info?.image}`"
                  v-if="token?.info?.image"
                />
                <div
                  v-else
                  class="inline-flex items-center justify-center w-12 h-12 text-xl text-white bg-indigo-500 rounded-full"
                >
              {{ token?.info?.name.substr(0, 1) }}
                </div>
         
            <span class="absolute bottom-1 end-1 block p-1 rounded-full transform translate-y-1/3 translate-x-1/3 w-5 h-5">
              <img :src="'/images/chains/' + props.chain + '.png'" alt="placeholder" />
            </span>
          </div>
          <div class="flex flex-col">
            <div class="text-md font-bold">{{ token?.info?.name }} ({{ token?.info?.symbol }})</div>
            <div class="text-xs text-zinc-400">{{ props.chain }} | {{ token?.exchange }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- --------SOCIALS------ -->
    <div class="flex w-full gap-1 mt-4">
      <div
        @click="token?.info?.website ? openLink(token?.info?.website) : null"
        class="flex bg-neutral-800 rounded-xl items-center py-1 px-4 w-full justify-center gap-1 text-xs text-zinc-300"
      >
        <Icon icon="mdi:web" class="w-4 h-4" />
        <span>Website</span>
      </div>
      <div
        @click="token?.info?.twitter ? openLink(token?.info?.twitter) : null"
        class="flex bg-neutral-800 rounded-xl items-center py-1 px-4 w-full justify-center gap-1 text-xs text-zinc-300"
      >
        <Icon icon="basil:twitter-outline" class="w-4 h-4" />
        <span>Twitter</span>
      </div>
      <div class="relative">
        <div
          @click="isOpenSocials = !isOpenSocials"
          class="flex bg-neutral-800 rounded-xl items-center py-1 px-3 text-sm jusstify-center text-zinc-300"
        >
          <Icon icon="ri:arrow-down-s-line" class="w-4 h-4" />
        </div>
        <div
          v-if="isOpenSocials"
          class="flex flex-col py-1 bg-neutral-800 rounded-xl absolute right-0 top-[calc(100%+5px)] text-xs w-[130px]"
        >
          <div
            v-for="(item, i) in socialInfo"
            :key="i"
            @click="openLink(item[1])"
            class="px-3 py-1 flex items-center gap-2 text-zinc-300"
          >
            <Icon :icon="`cib:${item[0]}`" />
            <span>{{ capitalizeFirstLetter(item[0]) }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- --------TOKEN VALUES------ -->
    <div class="grid grid-cols-6 gap-2">
      <div
        class="flex flex-col items-center col-span-3 px-2 py-1 w-full border border-neutral-800 rounded-xl"
      >
        <div class="text-[10px] text-zinc-400">PRICE</div>
        <div
          class="text-xs text-zinc-50 font-bold"
          v-html="numberFormat(token?.price?.price) || '-'"
        ></div>
      </div>
      <div
        class="flex flex-col items-center col-span-3 px-2 py-1 w-full border border-neutral-800 rounded-xl"
      >
        <div class="text-[10px] text-zinc-400">transactions</div>
        <div class="text-xs text-zinc-50 font-bold">
          {{ numberFormat(token?.additional?.transactions, 0, true) }}
        </div>
      </div>
      <div
        class="flex flex-col items-center col-span-2 px-2 py-1 w-full border border-neutral-800 rounded-xl"
      >
        <div class="text-[10px] text-zinc-400">TOTAL SUPPLY</div>
        <div
          class="text-xs text-zinc-50 font-bold"
          v-html="numberFormat(token?.additional?.totalSupply)"
        ></div>
      </div>
      <div
        class="flex flex-col items-center col-span-2 px-2 py-1 w-full border border-neutral-800 rounded-xl"
      >
        <div class="text-[10px] text-zinc-400">FDV</div>
        <div
          class="text-xs text-zinc-50 font-bold"
          v-html="numberFormat(token?.additional?.fdv)"
        ></div>
      </div>
      <div
        class="flex flex-col items-center col-span-2 px-2 py-1 w-full border border-neutral-800 rounded-xl"
      >
        <div class="text-[10px] text-zinc-400">MARKET CUP</div>
        <div
          class="text-xs text-zinc-50 font-bold"
          v-html="numberFormat(token?.price?.price * token?.additional?.totalSupply)"
        ></div>
      </div>
    </div>
    <!-- --------TOKEN VALUES------ -->
    <div class="grid grid-cols-4 rounded-xl border border-neutral-800">
      <div class="px-2 py-1 w-full flex flex-col items-center border-r border-neutral-800">
        <div class="text-xs text-zinc-400">5M</div>
        <div
          class="text-xs text-zinc-50 font-bold"
          v-html="numberFormat(token?.price?.price5m)"
        ></div>
      </div>
      <div class="px-2 py-1 w-full flex flex-col items-center border-r border-neutral-800">
        <div class="text-xs text-zinc-400">1H</div>
        <div
          class="text-xs text-zinc-50 font-bold"
          v-html="numberFormat(token?.price?.price1h)"
        ></div>
      </div>
      <div class="px-2 py-1 w-full flex flex-col items-center border-r border-neutral-800">
        <div class="text-xs text-zinc-400">6H</div>
        <div
          class="text-xs text-zinc-50 font-bold"
          v-html="numberFormat(token?.price?.price6h)"
        ></div>
      </div>
      <div class="px-2 py-1 w-full flex flex-col items-center">
        <div class="text-xs text-zinc-400">24H</div>
        <div
          class="text-xs text-zinc-50 font-bold"
          v-html="numberFormat(token?.price?.price24h)"
        ></div>
      </div>
    </div>
    <Card class="p-1 relative">
      <div class="flex gap-2 items-center justify-center w-full">
        <Icon icon="line-md:bell-loop" />
        <span>Set price alert</span>
      </div>
      <div class="absolute -top-1 right-0 text-xs px-2 bg-green-600 text-zinc-900 rounded-3xl">
        Soon
      </div>
    </Card>
    <!-- --------TOKEN INFO------ -->
    <div class="rounded-xl border border-neutral-800 text-xs">
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Contract Address</div>
        <div class="flex gap-1">
          <div class="bg-neutral-800 rounded-xl text-[10px] p-1 px-2">
            {{ shortenContractAddress(token?.info?.address, 4) || 'N/A' }}
          </div>
          <div class="bg-neutral-800 rounded-xl text-xs flex items-center justify-center px-2">
            <Icon icon="ion:copy" @click="copy(token?.info?.address)" />
          </div>
        </div>
      </div>
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Sell Tax <span class="text-[9px] text-zinc-400">(min/max)</span></div>
        <div
          class="text-[11px]"
          v-html="
            `${numberFormat(token?.audit?.sellTax?.min)} / ${numberFormat(token?.audit?.sellTax?.max)}`
          "
        ></div>
      </div>
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Black listed</div>
        <div class="text-[11px]">
          {{ capitalizeFirstLetter(token?.audit?.isBlacklisted) || 'N/A' }}
        </div>
      </div>
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Contract renounced</div>
        <div class="text-[11px]">
          {{ capitalizeFirstLetter(token?.audit?.isContractRenounced) || 'N/A' }}
        </div>
      </div>
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Honeypot</div>
        <div class="text-[11px]">
          {{ capitalizeFirstLetter(token?.audit?.isHoneypot) || 'N/A' }}
        </div>
      </div>
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Mintable</div>
        <div class="text-[11px]">
          {{ capitalizeFirstLetter(token?.audit?.isMintable) || 'N/A' }}
        </div>
      </div>
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Open source</div>
        <div class="text-[11px]">
          {{ capitalizeFirstLetter(token?.audit?.isOpenSource) || 'N/A' }}
        </div>
      </div>
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Potentially scam</div>
        <div class="text-[11px]">
          {{ capitalizeFirstLetter(token?.audit?.isPotentiallyScam) || 'N/A' }}
        </div>
      </div>
      <div
        class="flex w-full justify-between gap-2 border-b border-neutral-800 py-2 items-center px-2"
      >
        <div class="text-xs">Proxy</div>
        <div class="text-[11px]">
          {{ capitalizeFirstLetter(token?.audit?.isProxy) || 'N/A' }}
        </div>
      </div>
      <div class="flex w-full justify-between gap-2 py-2 items-center px-2">
        <div class="text-xs">Slippage modifiable</div>
        <div class="text-[11px]">
          {{ capitalizeFirstLetter(token?.audit?.slippageModifiable) || 'N/A' }}
        </div>
      </div>
    </div>
    <!-- Swapper card -->
    <div
      class="relative mt-12 pt-12 flex flex-col gap-2 bg-gradient-to-t from-neutral-800 from-10% via-neutral-800 via-30% to-green-500/20 to-90% rounded-lg p-3"
    >
      <div class="absolute w-full left-0 -top-10 flex justify-center">
         <img
                  class="inline-block w-[80px] h-[80px] rounded-full border-2"
                  :src="`${token?.info?.image}`"
                  v-if="token?.info?.image"
                />
                <div
                  v-else
                  class="inline-flex items-center justify-center w-[80px] h-[80px] text-xl text-white bg-indigo-500 rounded-full"
                >
              {{ token?.info?.name.substr(0, 1) }}
                </div>
      </div>
      <div class="text-center text-xs text-white">
        <div class="font-bold text-md">{{ token.info.name }} ({{ token.info.symbol }})</div>
      </div>
      <div class="flex gap-2 justify-center mt-2">
        <div
          @click="token?.info?.website ? openLink(token?.info?.website) : null"
          class="flex bg-neutral-600 rounded-xl items-center py-1 px-4 justify-center gap-1 text-xs text-zinc-300"
        >
          <Icon icon="mdi:web" class="w-4 h-4" />
          <span>Website</span>
        </div>
        <div
          @click="token?.info?.twitter ? openLink(token?.info?.twitter) : null"
          class="flex bg-neutral-600 rounded-xl items-center py-1 px-4 justify-center gap-1 text-xs text-zinc-300"
        >
          <Icon icon="basil:twitter-outline" class="w-4 h-4" />
          <span>Twitter</span>
        </div>
      </div>
      <hr class="border-neutral-600 my-3" />
      <div class="flex relative">
        <input
          v-model="calcToken"
          type="number"
          class="w-full bg-neutral-600 rounded-xl p-2 text-xs text-zinc-300 focus:outline-none"
          placeholder="0.0"
        />
        <span class="absolute right-2 top-1 text-zinc-300">{{ token.info.symbol }}</span>
      </div>
      <div class="flex justify-center">
        <Icon icon="iconamoon:swap" class="w-4 h-4 text-zinc-300" />
      </div>
      <div class="flex relative">
        <input
          v-model="calcUSD"
          type="number"
          class="w-full bg-neutral-600 rounded-xl p-2 text-xs text-zinc-300 focus:outline-none"
          placeholder="0.0"
        />
        <span class="absolute right-2 top-1 text-zinc-300">USD</span>
      </div>
    </div>
  </div>
</template>
