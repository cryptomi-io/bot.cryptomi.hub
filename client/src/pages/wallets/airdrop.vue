<script setup>
import { computed, onMounted } from 'vue'
import Button from '@/components/ui/Button.vue'

import { useTonWalletStore } from '@/store/wallets/ton-wallet'
import { useUserStore } from '@/store/user'

import Card from '@/components/ui/Card.vue'
import { toast } from 'vue3-toastify'
import { useTon } from '@/composables/useTon'
import { useWebApp } from 'vue-tg'
import { useNotifications } from '@/composables/useNotifications'
import { useRouter } from 'vue-router'
import { BackButton } from 'vue-tg'

const router = useRouter()
const userStore = useUserStore()
const TonWalletStore = useTonWalletStore()
const ton = useTon()
const { initDataUnsafe } = useWebApp()
const { notificationToAdmin } = useNotifications()

const userWallet = computed(() => TonWalletStore.wallet.address)

onMounted(async () => {})

const sendRequest = () => {
  try {
    const data = {
      wallet: ton.getUserFriendlyAddress(userWallet.value),
      uuid: userStore.profile?.uuid,
      nickname: userStore.profile?.nickname,
      tg: '@' + initDataUnsafe?.user?.username + ' ChatId:' + initDataUnsafe?.user?.id,
      balance: userStore.profile?.ctmi
    }

    const message =
      `<b>Airdrop request</b>\n` +
      `👤<b>Nickname:</b> ${data.nickname}\n` +
      `🆔<b>Uuid:</b> ${data.uuid}\n` +
      `💬<b>TG:</b> ${data.tg}\n` +
      `👝<b>Wallet:</b> ${data.wallet}\n` +
      `💰<b>CTMI:</b> ${data.balance}`

    notificationToAdmin(message)
    toast('Request sent', {
      autoClose: 1000,
      type: 'success',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    })
  } catch (e) {
    toast('Something went wrong', {
      autoClose: 1000,
      type: 'error',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    })
  }
}
function handleBackButton() {
  router.push('/')
}
</script>

<template>
  <BackButton @click="handleBackButton" />

  <div class="flex flex-col gap-3">
    <template v-if="!userWallet">
      <div class="text-zinc-400 flex flex-col items-center py-10 font-medium">
        Wallet is not connected
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col gap-2 justify-between h-[75vh]">
        <div class="flex items-center justify-center h-full">
          <img src="/images/trading.svg"/>
        </div>
        <Button @click="sendRequest" text="Get Airdrop" type="primary" class="!w-full" />
      </div>
    </template>
  </div>
</template>
