<script setup>
import Card from '@/components/ui/Card.vue'
import { useDextools } from '@/composables/useDextools'
import { useHelper } from '@/utils/helper'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useWebAppNavigation } from 'vue-tg'
import { toast } from 'vue3-toastify'

const { openLink } = useWebAppNavigation()
const { capitalizeFirstLetter, numberFormat, shortenContractAddress } = useHelper()
const {
  getTokenPriceByAddress,
  getTokenLockInfoByAddress,
  getTokenAdditInfoByAddress,
  getTokenAuditByAddress,
  getTokenInfoByAddress
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
  token.value.info = await getTokenInfoByAddress(props.chain, props.address)
  await setTimeout(async () => {
    token.value.lock = await getTokenLockInfoByAddress(props.chain, props.address)
  }, 300)
  await setTimeout(async () => {
    token.value.audit = await getTokenAuditByAddress(props.chain, props.address)
  }, 300)
  await setTimeout(async () => {
    token.value.additional = await getTokenAdditInfoByAddress(props.chain, props.address)
  }, 300)
  await setTimeout(async () => {
    token.value.price = await getTokenPriceByAddress(props.chain, props.address)
  }, 300)
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
</script>

<template>
  <div class="flex flex-col gap-3">
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
              class="inline-block w-10 h-10 rounded-full"
              :src="
                'https://www.dextools.io/resources/tokens/logos/' +
                props.chain +
                '/' +
                props.address +
                '.png'
              "
              alt="Image Description"
            />
            <span
              class="absolute z-10 top-1 end-1 block p-1 rounded-full transform translate-y-1/3 translate-x-1/3 border-1 w-5 h-5"
            >
              <img
                :src="'https://www.dextools.io/resources/chains/med/' + props.chain + '.png'"
                alt="placeholder"
              />
            </span>
          </div>
          <div class="flex flex-col">
            <div class="text-md font-bold">{{ token?.info?.name }} ({{ token?.info?.symbol }})</div>
            <div class="text-xs text-zinc-400">Ethereum | Exchange name</div>
          </div>
        </div>
      </div>
    </template>

    <!-- --------SOCIALS------ -->
    <div class="flex w-full gap-1 mt-4">
      <div
        @click="openLink(token?.info?.website)"
        class="flex bg-neutral-800 rounded-xl items-center py-1 px-4 w-full justify-center gap-1 text-xs text-zinc-300"
      >
        <Icon icon="mdi:web" class="w-4 h-4" />
        <span>Website</span>
      </div>
      <div
        @click="openLink(token?.info?.twitter)"
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
          v-html="numberFormat(token?.additional?.mcup)"
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
  </div>
</template>
../../../composables/useDextools../../../utils/helper