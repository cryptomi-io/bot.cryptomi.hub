<script setup>
import Card from '@/components/ui/Card.vue'
import { useDextools } from '@/composables/useDextools'
import { onMounted, ref } from 'vue'
const {
   getTokenPriceByAddress,
   getTokenLockInfoByAddress,
   getTokenAdditInfoByAddress,
   getTokenAuditByAddress,
   getTokenInfoByAddress,
} = useDextools()
const props = defineProps({
  chain: String,
  address: String,
});
const isLoading = ref(true)
const token = ref(null)
isLoading.value = true
  token.info = await getTokenInfoByAddress(props.chain, props.address)
  token.lock = await getTokenLockInfoByAddress(props.chain, props.address)
  token.audit = await getTokenAuditByAddress(props.chain, props.address)
  token.addit = await getTokenAdditInfoByAddress(props.chain, props.address)
  token.price = await getTokenPriceByAddress(props.chain, props.address)
  console.log("+++++ price")
  console.log(token)
  isLoading.value = false
  
</script>

<template>
  <div class="flex items-center w-full">
    <template v-if="isLoading">
      <div class="rounded-full animate-pulse bg-neutral-700 h-10 w-10"></div>
      <div class="flex flex-col animate-pulse">
        <div class="h-4 bg-neutral-700 rounded w-20"></div>
        <div class="h-2 bg-neutral-700 mt-1 rounded w-12"></div>
      </div>
    </template>
    <template v-else>
     <div class="flex gap-2">
        <div class="relative inline-block">
          <img class="inline-block w-10 h-10 rounded-full" 
            :src="'https://www.dextools.io/resources/tokens/logos/'+ props.chain +'/'+ props.address +'.png'" alt="Image Description">
          <span class="absolute top-1 end-1 block p-1 rounded-full transform translate-y-1/3 translate-x-1/3 border-1 w-5 h-5">
                             <img
              :src="'https://www.dextools.io/resources/chains/med/'+ props.chain +'.png'"
              alt="placeholder" />
           
              </span>
        </div>
        <div class="flex flex-col">
          <div class="text-md font-bold">SHALALA</div>
          <div class="text-xs text-zinc-400">SHALALA / USDT</div>
        </div>
     </div>
     <div class="flex flex-col items-end">
        <div class="text-md text-green-500 font-bold">+16%</div>
        <div class="text-xs text-zinc-400">0.0025 ETH </div>
      </div>

    </template>
  </div>
</template>


