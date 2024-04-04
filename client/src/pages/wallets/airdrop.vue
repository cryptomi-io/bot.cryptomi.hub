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
      <Card class="py-5 px-4 gap-2 items-center flex-col text-zinc-100">
        <div class="text-sm">Please send request for get airdrop</div>
        <Button @click="sendRequest" text="Get" type="primary" class="!w-full" />
      </Card>
    </template>
  </div>
</template>
