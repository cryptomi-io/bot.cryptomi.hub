<script setup>
import { computed, onMounted, watch } from 'vue'
import { useTonWalletStore } from '@/store/wallets/ton-wallet'
import { useHelper } from '@/utils/helper'
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { useTon } from '@/composables/useTon'

const ton = useTon()
const TonWalletStore = useTonWalletStore()
const userWallet = computed(() => TonWalletStore.wallet.address)
const { shortenContractAddress, numberFormat } = useHelper()
const address = ref('')
const balance = ref(0)
const transactions = ref([])

onMounted(async () => {
  if (!userWallet.value) return
  address.value = await ton.getUserFriendlyAddress(userWallet.value)
  balance.value = await ton.getBalance(userWallet.value)
  transactions.value = await ton.getTransactions(userWallet.value)
})

watch(userWallet.value, async (newVal) => {
  if (!newVal) return
  debugger
  address.value = await ton.getUserFriendlyAddress(newVal)
  balance.value = await ton.getBalance(newVal)
  transactions.value = await ton.getTransactions(newVal)
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
    <template v-if="userWallet">
      <Card class="py-5 px-4 gap-2 items-center flex-col text-zinc-100">
        <div class="text-3xl">
          {{ numberFormat(balance, 3, true) }} <span class="text-lg">TON</span>
        </div>
        <div class="text-xs flex gap-2 items-center" @click="copy(address)">
          {{ shortenContractAddress(address) }}
          <Icon icon="ion:copy" class="w-3 h-3 text-zinc-100" />
        </div>
      </Card>
      <Card class="py-3 px-4 gap-2 !items-start flex-col text-zinc-100">
        <div class="text-md">Transactions</div>
        <template v-if="!transactions.length">
          <div class="py-5 flex justify-center w-full text-md">Not found</div>
        </template>
        <template v-else>
          <div class="flex fex-col gap-2">
            <div class="flex justify-between gap-2" v-for="(item, i) in transactions" :key="i">
              <!-- <div class="flex flex-col gap-1">
              <div class="text-xs text-zinc-100 font-medium">Отправить</div>

              <div class="text-xs text-zinc-400">
                To: {{ getUserFriendlyAddress(item.address) }}
              </div>
            </div>
            <div class="flex flex-col gap-1 items-end">
              <div class="text-xs text-zinc-100 font-medium">100</div>
              <div class="text-xs text-zinc-400 font-light">09.09.2024</div>
            </div> -->
              <pre class="flex flex-col text-xs">
              address: {{ item.address }} description: {{ item.description }} endStatus:
              {{ item.endStatus }} lt: {{ item.lt }} now: {{ item.now }} oldStatus:
              {{ item.oldStatus }} prevTransactionHash:
              {{ item.prevTransactionHash }} prevTransactionLt:
              {{ item.prevTransactionLt }} totalFees: {{ item.totalFees }}
            </pre
              >
            </div>
          </div>
        </template>
      </Card>
    </template>
    <template v-else>
      <div class="text-zinc-400 flex flex-col items-center py-10 font-medium">
        Wallet is not connected
      </div>
    </template>
  </div>
</template>
