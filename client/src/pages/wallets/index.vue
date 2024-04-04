<script setup>
import { onMounted } from 'vue'
import { useTonWalletStore } from '@/store/wallets/ton-wallet'
import { useHelper } from '@/utils/helper'
import { Address, TonClient } from 'ton'
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'

const TON_API_KEY = import.meta.env.VITE_TON_API_KEY
const TonWalletStore = useTonWalletStore()
const { shortenContractAddress } = useHelper()
const address = ref('')
const balance = ref(0)
const transactions = ref([])

onMounted(async () => {
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC'
    // apiKey: TON_API_KEY
  })
  // const walletAddress = Address.parse(TonWalletStore.wallet.address)
  const walletAddress = Address.parse(
    '0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e'
  )
  address.value = walletAddress.toString()

  const result = await client.runMethod(walletAddress, 'get_total')
  balance.value = result.stack.readNumber()
  console.log(result.stack.readNumber())
  // transactions.value = await client.getTransactions(walletAddress, {
  //   limit: 5
  // })
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
    <Card class="py-5 px-4 gap-2 items-center flex-col text-zinc-100">
      <div class="text-3xl">{{ balance }} <span class="text-lg">TON</span></div>
      <div class="text-xs flex gap-2 items-center" @click="copy(address)">
        {{ shortenContractAddress(address) }}
        <Icon icon="ion:copy" class="w-3 h-3 text-zinc-100" />
      </div>
    </Card>
    <Card class="py-3 px-4 gap-2 !items-start flex-col text-zinc-100">
      <div class="text-md">Transactions</div>
      <div class="py-5 flex justify-center w-full text-md">Not found</div>
    </Card>
  </div>
</template>
