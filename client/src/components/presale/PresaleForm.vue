<script setup>
import { Icon } from '@iconify/vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useTon } from '@/composables/useTon'
import { usePresale } from '@/composables/usePresale'
import { useTonWalletStore } from '@/store/wallets/ton-wallet'
import { useUserStore } from '@/store/user'
import { toast } from 'vue3-toastify'
import { useWebApp } from 'vue-tg'
import { toNano } from 'ton'
import { useHelper } from '@/utils/helper'
import TonWeb from 'tonweb'

//transfer
import { mnemonicToPrivateKey } from 'ton-crypto'
import {mnemonicToKeyPair} from "tonweb-mnemonic";

const { JettonMinter, JettonWallet } = TonWeb.token.jetton
//transfer end

//TG
const { initDataUnsafe } = useWebApp()
let chatId = 6754514128
if (import.meta.env.VITE_NODE_ENV !== 'development') {
  chatId = initDataUnsafe?.user?.id
}

//Hooks

const ton = useTon()

const presale = usePresale()
const { numberFormat } = useHelper()

//Store
const TonWalletStore = useTonWalletStore()
const userStore = useUserStore()

//Computed
// const userWallet = computed(() => TonWalletStore.wallet.address)
const userWallet = computed(() => 'UQCV3YdlxazBZpIeb-7426nun1B-yyMrAtUNdl5zubWYfRQv')
const profile = computed(() => userStore.profile || {})

//UI REFS
const openUsefullInfo = ref(false)
const openSwapInfo = ref(false)
const refreshTimer = ref('00:15')
const isLoading = ref(false)
//Info
const account = ref(null)
const lastTransaction = ref(null)
const tonBalance = ref(0)
const ctmiBalance = ref(0)
const tonUsdtPrice = ref(0)
const ctmiUsdtPrice = ref(0)
const ctmiTonPrice = ref(0)
const ctmiRate = ref(null)

//Interval
const updatePriceInterval = ref(null)

//FORM

const formData = ref({
  tonAmount: 10,
  ctmiAmount: 0
})

onMounted(async () => {
  isLoading.value = true
  await init()
  isLoading.value = false
})
onBeforeUnmount(() => {
  clearInterval(updatePriceInterval.value)
})

watch(userWallet.value, async (newVal) => {
  if (!newVal) return
  account.value = await ton.getAccount(newVal)
})

watch(formData.value, async (newValue) => {
  if (formData.value.tonAmount <= 0) {
    formData.value.ctmiAmount = 0
  } else {
    const price = await getCtmiPrice(newValue.tonAmount)
    formData.value.ctmiAmount = (newValue.tonAmount * price).toFixed(4)
  }
})

//functions
const init = async () => {
  isLoading.value = true
  ctmiRate.value = await presale.getRate()
  lastTransaction.value = await presale.getLastTransaction()
  userStore.fetchProfile()
  account.value = await ton.getAccount(userWallet.value)

  tonBalance.value = account.value?.balance || 0
  tonUsdtPrice.value = await presale.getPrice('TON')
  ctmiTonPrice.value = await getCtmiPrice(1)
  ctmiUsdtPrice.value = tonUsdtPrice.value / ctmiTonPrice.value

  const defiWalletBalance =
    account.value?.wallets &&
    account.value?.wallets.find((item) => item.currency === 'CTMI')?.available_balance

  ctmiBalance.value = defiWalletBalance || profile.value?.ctmi || 0
  formData.value.ctmiAmount = formData.value.tonAmount * ctmiTonPrice.value

  isLoading.value = false

  // initUpdatePriceInterval(async () => {
  //   init()
  // })
}
const initUpdatePriceInterval = async (callback) => {
  let time = 15
  updatePriceInterval.value = setInterval(async () => {
    time = time - 1
    refreshTimer.value = `00:${time < 10 ? '0' + time : time}`
    if (time < 1) {
      clearInterval(updatePriceInterval.value)
      if (callback) {
        callback()
      }
    }
  }, 1000)
}
const getCtmiPrice = async (amount) => {
  const defaultPrice = lastTransaction.value?.price_ton || 35000
  const lastTransactionTotalSum = lastTransaction.value
    ? lastTransaction.value?.price_usdt * lastTransaction.value?.amount
    : 0

  const price =
    defaultPrice -
    (0.75 * (amount * tonUsdtPrice.value + lastTransactionTotalSum)) / tonUsdtPrice.value

  return price
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const transfer = async () => {
  console.log('transfer start')
  const JETTON_WALLET_ADDRESS = 'EQB-7zmoFD21TpedIAu4HAo5P2mU-NfQhtbp3xNnlwetbl0E'


  console.log('-----------------------------------')


    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://toncenter.com/api/v2/jsonRPC', {
            apiKey: '27dfe35981c2b60031be8e7bd27e44596696c73cc4672d6ee17c99fa67ac6e7a'
        })
    );
    const mnemonic =
    'tail cushion action idle album network detect glory birth barrel prosper wing base motor shy bone head record pride fury access village key endless'

    const destinationAddress = new TonWeb.Address('UQDhkGqIoT2xq03WAwWo_I-xaEJowcTm_d1hptYeAzhbjMMk');

    const forwardPayload = new TonWeb.boc.Cell();
    forwardPayload.bits.writeUint(0, 32); // 0 opcode means we have a comment
    forwardPayload.bits.writeString('Hello, CRYPTOMI SALE TEST!');

    /*
        Tonweb has a built-in class for interacting with jettons, which has
        a method for creating a transfer. However, it has disadvantages, so
        we manually create the message body. Additionally, this way we have a
        better understanding of what is stored and how it functions.
     */

    const jettonTransferBody = new TonWeb.boc.Cell();
    jettonTransferBody.bits.writeUint(0xf8a7ea5, 32); // opcode for jetton transfer
    jettonTransferBody.bits.writeUint(0, 64); // query id
    jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN('5')); // jetton amount, amount * 10^9
    jettonTransferBody.bits.writeAddress(destinationAddress);
    jettonTransferBody.bits.writeAddress(destinationAddress); // response destination
    jettonTransferBody.bits.writeBit(false); // no custom payload
    jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0.0001')); // forward amount
    jettonTransferBody.bits.writeBit(true); // we store forwardPayload as a reference
    jettonTransferBody.refs.push(forwardPayload);

    const keyPair = await mnemonicToKeyPair(mnemonic.split(' '));
    const jettonWallet = new TonWeb.token.ft.JettonWallet(tonweb.provider, {
        address: JETTON_WALLET_ADDRESS
    });

    // available wallet types: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // workchain
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: jettonWallet.address,
        amount: tonweb.utils.toNano('0.1'),
        seqno: await wallet.methods.seqno().call(),
        payload: jettonTransferBody,
        sendMode: 3
    }).send(); // create transfer and send it




  return
  if (formData.value.tonAmount < 10) {
    toast('Minimum amount is 10 TON', {
      autoClose: 3000,
      type: 'warning',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    })
    return
  }
  const walletTo = 'UQCV3YdlxazBZpIeb-7426nun1B-yyMrAtUNdl5zubWYfRQv'

  //calculate CTMI sum
  const amount = Number(toNano(formData.value.tonAmount))

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
    messages: [
      {
        address: walletTo,
        amount: amount
        // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
      }
    ]
  }

  try {
    await window.tonConnectUI.sendTransaction(transaction)
    await presale.createTransaction({
      user_id: chatId,
      wallet_address: ton.getUserFriendlyAddress(account.value?.address),
      amount: formData.value.ctmiAmount,
      price_ton: formData.value.ctmiAmount / formData.value.tonAmount,
      price_usdt: tonUsdtPrice.value / ctmiTonPrice.value
    })

    formData.value.ctmiAmount = 0
    formData.value.tonAmount = 0
    toast('Transaction was sent successfully', {
      autoClose: 3000,
      type: 'success',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    }) // ToastOptions
  } catch (e) {
    toast('Something went wrong', {
      autoClose: 3000,
      type: 'error',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    }) // ToastOptions
    console.error(e)
  }
}
</script>
<template>
  <div class="flex flex-col gap-1 items-center mt-2">
    <div class="font-bold text-white text-xl">CRYPTOMI First pre-sale</div>
    <div class="text-zinc-400 text-sm text-center">
      More freedom and dozens of exclusive features with CRYPTOMI platform
    </div>
  </div>
  <template v-if="isLoading">
    <Card class="flex flex-col py-3">
      <div class="flex justify-between w-full px-2 mb-2">
        <div class="text-lg text-zinc-100 font-medium">Buy CTMI</div>
        <div class="flex gap-1 items-center">
          <span
            class="w-[41px] h-[20px] shrink-0 inline-flex rounded-full animate-pulse bg-neutral-700"
          ></span>
          <span
            class="w-[20px] h-[20px] shrink-0 inline-flex rounded-full animate-pulse bg-neutral-700"
          ></span>
        </div>
      </div>

      <div class="flex w-full px-2 justify-between items-start">
        <div class="flex flex-col">
          <div class="text-sm text-zinc-400">You send</div>
          <div class="flex items-center gap-1">
            <svg
              width="32"
              height="32"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
                fill="#0098EA"
              />
              <path
                d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
                fill="white"
              />
            </svg>
            <div class="text-2xl text-zinc-100 font-bold">TON</div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex gap-1 items-center text-zinc-400 text-sm">
            <Icon icon="solar:wallet-linear" class="w-4 h-4" />
            <span
              class="w-[40px] h-[15px] shrink-0 inline-flex rounded-full animate-pulse bg-neutral-700"
            ></span>
          </div>
          <input
            type="number"
            placeholder="0.00"
            class="w-full bg-transparent text-3xl font-bold text-right text-zinc-100 focus:outline-none"
          />
          <div class="flex gap-1 items-center text-zinc-400 text-sm">
            <span
              class="w-[40px] h-[15px] shrink-0 inline-flex rounded-full animate-pulse bg-neutral-700"
            ></span>
          </div>
        </div>
      </div>
      <!-- SEPORATE -->
      <div class="relative border-b border-zinc-400 w-full my-4">
        <div
          class="border border-zinc-400 w-[30px] h-[30px] absolute left-[calc(50%_-_15px)] bg-neutral-800 top-[-15px] rounded-full flex items-center justify-center"
        >
          <Icon icon="mingcute:transfer-4-line" class="w-5 h-5 text-zinc-100" />
        </div>
      </div>
      <!-- END SEPORATE -->
      <div class="flex w-full px-2 justify-between items-start">
        <div class="flex flex-col shrink-0">
          <div class="text-sm text-zinc-400 text-nowrap">You receive</div>
          <div class="flex items-center gap-1">
            <img src="/images/assets/ctmi.png" class="w-8 h-8" />
            <div class="text-2xl text-zinc-100 font-bold">CTMI</div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex gap-1 items-center text-zinc-400 text-sm">
            <Icon icon="solar:wallet-linear" class="w-4 h-4" />
            <span
              class="w-[40px] h-[15px] shrink-0 inline-flex rounded-full animate-pulse bg-neutral-700"
            ></span>
          </div>
          <input
            type="number"
            placeholder="0.00"
            class="w-full bg-transparent text-3xl font-bold text-right text-zinc-100 focus:outline-none"
          />
          <div class="flex gap-1 items-center text-zinc-400 text-sm">
            <span
              class="w-[40px] h-[15px] shrink-0 inline-flex rounded-full animate-pulse bg-neutral-700"
            ></span>
          </div>
        </div>
      </div>
      <!-- SEPORATE -->
      <div class="relative border-b border-zinc-400 w-full my-2"></div>
      <!-- END SEPORATE -->
      <div class="flex flex-col gap-2 w-full px-2">
        <div class="flex items-center justify-between text-sm text-zinc-100">
          <span
            class="w-[100px] h-[15px] shrink-0 inline-flex rounded-full animate-pulse bg-neutral-700"
          ></span>
          <Icon
            :icon="`solar:alt-arrow-${openSwapInfo ? 'up' : 'down'}-linear`"
            class="w-5 h-5 text-zinc-100"
          />
        </div>
      </div>
      <div class="px-2 w-full mt-2">
        <Button text="Buy now!*" :disabled="true" type="secondary" class="w-full rounded-xl" />
      </div>
    </Card>
  </template>
  <template v-else>
    <Card class="flex flex-col py-3">
      <div class="flex justify-between w-full px-2 mb-2">
        <div class="text-lg text-zinc-100 font-medium">Buy CTMI</div>
        <div class="flex gap-1 items-center">
          <div class="text-zinc-100">{{ refreshTimer }}</div>
          <div class="">
            <Icon icon="solar:refresh-circle-broken" class="w-5 h-5 text-zinc-400" />
          </div>
        </div>
      </div>

      <div class="flex w-full px-2 justify-between items-start">
        <div class="flex flex-col shrink-0">
          <div class="text-sm text-zinc-400">You send</div>
          <div class="flex items-center gap-1 mt-1">
            <svg
              width="32"
              height="32"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
                fill="#0098EA"
              />
              <path
                d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
                fill="white"
              />
            </svg>
            <div class="text-2xl text-zinc-100 font-bold">TON</div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex gap-1 items-center text-zinc-400 text-sm">
            <Icon icon="solar:wallet-linear" class="w-4 h-4" />
            <span>{{ tonBalance }}</span>
          </div>
          <input
            type="number"
            placeholder="0.00"
            v-model="formData.tonAmount"
            class="w-full bg-transparent text-3xl font-bold text-right text-zinc-100 focus:outline-none"
          />
          <div v-if="tonUsdtPrice" class="flex gap-1 items-center text-zinc-400 text-sm">
            <span>${{ tonUsdtPrice.toFixed(4) }}</span>
          </div>
        </div>
      </div>
      <!-- SEPORATE -->
      <div class="relative border-b border-zinc-400 w-full my-4">
        <div
          class="border border-zinc-400 w-[30px] h-[30px] absolute left-[calc(50%_-_15px)] bg-neutral-800 top-[-15px] rounded-full flex items-center justify-center"
        >
          <Icon icon="mingcute:transfer-4-line" class="w-5 h-5 text-zinc-100" />
        </div>
      </div>
      <!-- END SEPORATE -->
      <div class="flex w-full px-2 justify-between items-start">
        <div class="flex flex-col shrink-0">
          <div class="text-sm text-zinc-400">You receive</div>
          <div class="flex items-center gap-1 mt-1">
            <img src="/images/assets/ctmi.png" class="w-8 h-8" />
            <div class="text-2xl text-zinc-100 font-bold">CTMI</div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex gap-1 items-center text-zinc-400 text-sm">
            <Icon icon="solar:wallet-linear" class="w-4 h-4" />
            <span>{{ numberFormat(ctmiBalance) }}</span>
          </div>
          <input
            type="number"
            placeholder="0.00"
            v-model="formData.ctmiAmount"
            class="w-full bg-transparent text-3xl font-bold text-right text-zinc-100 focus:outline-none"
          />
          <div v-if="ctmiUsdtPrice" class="flex gap-1 items-center text-zinc-400 text-sm">
            <span>${{ ctmiUsdtPrice.toFixed(4) }}</span>
          </div>
        </div>
      </div>
      <!-- SEPORATE -->
      <div class="relative border-b border-zinc-400 w-full my-2"></div>
      <!-- END SEPORATE -->
      <div class="flex flex-col gap-2 w-full px-2 py-3">
        <div
          v-if="ctmiTonPrice"
          class="flex items-center justify-between text-sm text-zinc-100"
          @click="openSwapInfo = !openSwapInfo"
        >
          <div>1 TON ≈ {{ ctmiTonPrice.toFixed(4) }} CTMI</div>
          <Icon
            :icon="`solar:alt-arrow-${openSwapInfo ? 'up' : 'down'}-linear`"
            class="w-5 h-5 text-zinc-100"
          />
        </div>
        <div class="flex flex-col gap-1 text-zinc-100 text-sm" v-if="openSwapInfo">
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">1 TON price</span> <span>≈ {{ ctmiTonPrice }} CTMI</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">1 CTMI price</span> <span>≈ 0.225673416 TON</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Price rate</span>
            <span
              class="text-xs"
              v-if="ctmiRate?.diff"
              :class="[ctmiRate?.diff > 0 ? 'text-green-500' : 'text-red-500']"
            >
              {{ ctmiRate?.diff > 0 ? '+' : '-' }}{{ ctmiRate?.diff?.toFixed(2) }}%
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Minimum send</span> <span>10 TON</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Route</span> <span>TON > CTMI</span>
          </div>
        </div>
      </div>
      <div class="px-2 w-full mt-2">
        <Button text="Buy now!*" type="primary" @click="transfer" class="w-full rounded-xl" />
      </div>
    </Card>
  </template>
  <div class="">
    <div
      class="text-zinc-100 text-sm flex gap-1 items-center"
      @click="openUsefullInfo = !openUsefullInfo"
    >
      <div class="flex gap-1 items-center">
        <Icon icon="gravity-ui:file-arrow-right" class="w-5 h-5 text-zinc-100" />
        <span class="font-medium">Usefull information *</span>
      </div>
    </div>
    <div class="w-full text-sm text-white mt-2" v-if="openUsefullInfo">
      <h4>
        * Can also send TON to UQCV3YdlxazBZpIeb-7426nun1B-yyMrAtUNdl5zubWYfRQv or to cryptomi.ton
        from a decentralised wallet
      </h4>
      <h4>** Then Wait for <span class="line-through">Moon</span> Airdrop</h4>
    </div>
  </div>
</template>
