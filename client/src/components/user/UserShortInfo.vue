<script setup>
import { useUserStore } from '@/store/user'
import { useTonWalletStore } from '@/store/wallets/ton-wallet'
import { computed, onMounted, ref } from 'vue'

import { TonConnectUI } from '@tonconnect/ui'

const isLoading = ref(true)
const userStore = useUserStore()
const TonWalletStore = useTonWalletStore()
const profile = computed(() => userStore.profile || {})

onMounted(async () => {
  isLoading.value = true
  userStore.fetchProfile()
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://hub.cryptomi.io/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
  })

  tonConnectUI.connectionRestored.then((restored) => {
    if (restored) {
      TonWalletStore.setWallet(tonConnectUI.account)
      TonWalletStore.setIsConnected(tonConnectUI.connected)
    } else {
      console.log('Connection was not restored.')
    }
  })
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
<template>
  <div class="flex items-center gap-4 justify-between">
    <template v-if="isLoading">
      <div class="rounded-full animate-pulse bg-neutral-700 h-10 w-10"></div>
      <div class="flex flex-col animate-pulse">
        <div class="h-4 bg-neutral-700 rounded w-20"></div>
        <div class="h-2 bg-neutral-700 mt-1 rounded w-12"></div>
      </div>
    </template>
    <template v-else>
      <img
        :src="
          profile?.avatar
            ? 'https://cryptomi.io' + profile?.avatar
            : 'http://placeholder.co/300x300'
        "
        alt="placeholder"
        class="w-10 h-10 rounded-full"
      />
      <div class="flex flex-col">
        <div class="text-md font-bold">@{{ profile?.nickname }}</div>
        <!-- <div class="text-xs text-zinc-400">{{ profile?.uuid }}</div> -->
      </div>
    </template>
    <div id="ton-connect"></div>
  </div>
</template>
