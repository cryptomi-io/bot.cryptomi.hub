<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { toNano, Address } from 'ton'
import { useTon } from '@/composables/useTon'
import { usePresale } from '@/composables/usePresale'
import { useTonWalletStore } from '@/store/wallets/ton-wallet'
import { TonConnectUI } from '@tonconnect/ui'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useWebApp } from 'vue-tg'
import { toast } from 'vue3-toastify'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const { initDataUnsafe } = useWebApp()
let chatId = 6754514128
if (import.meta.env.VITE_NODE_ENV !== 'development') {
  chatId = initDataUnsafe?.user?.id
}

const tokenomicTerms = [
  {
    title: 'Ecosystem',
    description:
      "These tokens are intended to support and develop the Cryptomi ecosystem, including partner projects and integrations. The distribution of these tokens motivates holders to actively participate in the platform's development.",
    data: [
      {
        name: 'Total supply',
        value: '10%'
      },
      {
        name: 'Initial unlock',
        value: '10%'
      },
      {
        name: 'Amount',
        value: '200,000,000'
      },
      {
        name: 'Vesting',
        value: '-'
      }
    ]
  },
  {
    title: 'Referral Program',
    description:
      'Tokens from this block are aimed at rewarding users for attracting new clients. This incentivizes users to actively bring in new clients and expand the Cryptomi user base.',
    data: [
      {
        name: 'Total supply',
        value: '15%'
      },
      {
        name: 'Initial unlock',
        value: '15%'
      },
      {
        name: 'Amount',
        value: '300,000,000'
      },
      {
        name: 'Vesting',
        value: '-'
      }
    ]
  },
  {
    title: 'Branding and Influencers',
    description:
      'These tokens are allocated for marketing initiatives, including collaboration with influencers. This allows Cryptomi to actively promote its platform and attract the attention of new users.',
    data: [
      {
        name: 'Total supply',
        value: '10%'
      },
      {
        name: 'Initial unlock',
        value: '10%'
      },
      {
        name: 'Amount',
        value: '200,000,000'
      },
      {
        name: 'Vesting',
        value: '-'
      }
    ]
  },
  {
    title: 'Airdrop',
    description:
      "These tokens are allocated to reward the community in the early stages of the project's development. Airdrop allows Cryptomi to interest and attract a wide audience of users from the start.",
    data: [
      {
        name: 'Total supply',
        value: '15%'
      },
      {
        name: 'Initial unlock',
        value: '15%'
      },
      {
        name: 'Amount',
        value: '300,000,000'
      },
      {
        name: 'Vesting',
        value: '-'
      }
    ]
  },
  {
    title: 'Team Incentives',
    description:
      'These tokens are reserved for rewarding Cryptomi employees and management. This provides motivation and retention of talented specialists in the team and contributes to the successful development of the project.',
    data: [
      {
        name: 'Total supply',
        value: '15%'
      },
      {
        name: 'Initial unlock',
        value: '0%'
      },
      {
        name: 'Amount',
        value: '300,000,000'
      },
      {
        name: 'Vesting',
        value: '-'
      }
    ]
  },
  {
    title: 'Cryptomi Protection Fund',
    description:
      'These tokens ensure the financial stability and security of the platform. The stability fund provides reserve funds to protect the platform from possible financial risks.',
    data: [
      {
        name: 'Total supply',
        value: '10%'
      },
      {
        name: 'Initial unlock',
        value: '0%'
      },
      {
        name: 'Amount',
        value: '200,000,000'
      },
      {
        name: 'Vesting',
        value: '-'
      }
    ]
  },
  {
    title: 'Exchange',
    description:
      'These tokens are intended to support exchange operations within the ecosystem. Exchange tokens facilitate the process of conducting operations on the Cryptomi platform.',
    data: [
      {
        name: 'Total supply',
        value: '25%'
      },
      {
        name: 'Initial unlock',
        value: '25%'
      },
      {
        name: 'Amount',
        value: '500,000,000'
      },
      {
        name: 'Vesting',
        value: '-'
      }
    ]
  }
]
const faqTerms = [
  {
    title: 'What is a SAAS platform?',
    description:
      'SAAS platform is a cloud-based software service that allows users to access and use a variety of tools and functionality.'
  },
  {
    title: 'How does billing work?',
    description:
      'We offers a variety of billing options, including monthly and annual subscription plans, as well as pay-as-you-go pricing for certain services. Payment is typically made through a credit card or other secure online payment method.'
  },
  {
    title: 'Can I get a refund for my subscription?',
    description:
      'We offers a 30-day money-back guarantee for most of its subscription plans. If you are not satisfied with your subscription within the first 30 days, you can request a full refund. Refunds for subscriptions that have been active for longer than 30 days may be considered on a case-by-case basis.'
  },
  {
    title: 'How do I cancel my subscription?',
    description:
      'To cancel your We subscription, you can log in to your account and navigate to the subscription management page. From there, you should be able to cancel your subscription and stop future billing.'
  },
  {
    title: 'Can I try this platform for free?',
    description:
      'We offers a free trial of its platform for a limited time. During the trial period, you will have access to a limited set of features and functionality, but you will not be charged.'
  },
  {
    title: 'How do I access documentation?',
    description:
      "Documentation is available on the company's website and can be accessed by logging in to your account. The documentation provides detailed information on how to use the , as well as code examples and other resources."
  },
  {
    title: 'How do I contact support?',
    description:
      "If you need help with the platform or have any other questions, you can contact the company's support team by submitting a support request through the website or by emailing support@We.com."
  },
  {
    title: 'Do you offer any discounts or promotions?',
    description:
      "We may offer discounts or promotions from time to time. To stay up-to-date on the latest deals and special offers, you can sign up for the company's newsletter or follow it on social media."
  },
  {
    title: 'How do we compare to other similar services?',
    description:
      'This platform is a highly reliable and feature-rich service that offers a wide range of tools and functionality. It is competitively priced and offers a variety of billing options to suit different needs and budgets.'
  }
]
const assistantTerms = [
  {
    title: 'Wallet Analytics',
    description:
      ' We have developed a software solution that tracks the activity of "smart" wallets, helping to improve the chances of profitable transactions. Observing their investments in coins provides users with valuable signals for investing. This tool becomes the key to successfully selecting tokens for investment. '
  },
  {
    title: 'Crypto Exchange',
    description:
      ' We have launched a crypto exchange without the KYC process, offering staking services, AI-supported trading strategies, and P2P transactions. It features low fees on spot trading, facilitating investments and maximizing returns. Provides privacy, advantageous conditions for earning through staking, and high-tech solutions for efficient trading'
  },
  {
    title: 'Introducing the incredible DeFi Wallet!',
    description:
      'This is not just any wallet; its your personal financial gateway into the cryptocurrency world, operating directly through your Telegram wallet. With it, you gain the freedom to interact not only with TON but also with other leading cryptocurrencies - ETH, BTC, TRON, SOLANA, and many other popular networks. Convenience, security, and diversity - everything a modern crypto enthusiast needs. Dive into the world of DeFi with us!'
  },
  {
    title: 'Token Insight',
    description:
      'Leverage our multifaceted and robust platform to effortlessly identify the most dynamic tokens and receive notifications about emerging ones.'
  },
  {
    title: 'AI Assistant',
    description:
      'Discover the ease of voice control and a personal financial advisor in the DeX world.'
  }
]
const presale = usePresale()
const ton = useTon()
const account = ref(null)
const TonWalletStore = useTonWalletStore()
const userWallet = computed(() => TonWalletStore.wallet.address)

const formData = ref({
  tonAmount: 10,
  ctmiAmount: 0
})

const isLoading = ref(true)

const ctmiPrice = ref(0)

const tonPrice = ref(0)
const lastTransaction = ref(0)
const updatePriceInterval = ref(null)

onMounted(async () => {
  if (!userWallet.value) return
  account.value = await ton.getAccount(userWallet.value)
  tonPrice.value = await presale.getPrice('TON')
  lastTransaction.value = await presale.getLastTransaction()
  ctmiPrice.value = await getCtmiPrice(1)
  console.log(ctmiPrice.value)
  isLoading.value = false

  updatePriceInterval.value = setInterval(async () => {
    isLoading.value = true
    tonPrice.value = await presale.getPrice('TON')
    lastTransaction.value = await presale.getLastTransaction()
    ctmiPrice.value = await getCtmiPrice(1)
    formData.value.ctmiAmount = (formData.value.tonAmount * ctmiPrice.value).toFixed(4)
    isLoading.value = false
  }, 10000)
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
const transfer = async () => {
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
      price_ton: ctmiPrice.value,
      price_usdt: tonPrice.value / ctmiPrice.value
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
const getCtmiPrice = async (amount) => {
  isLoading.value = true
  const defaultPrice = lastTransaction.value?.price_ton || 35000
  const lastTransactionTotalSum = lastTransaction.value
    ? lastTransaction.value?.price_usdt * lastTransaction.value?.amount
    : 0

  const price =
    defaultPrice - (0.75 * (amount * tonPrice.value + lastTransactionTotalSum)) / tonPrice.value
  isLoading.value = false
  return price
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <img src="/images/premium.png" class="hidden" alt="premium" />
    <div class="flex flex-col gap-1 items-center mt-2">
      <div class="font-bold text-white text-xl">CRYPTOMI First pre-sale</div>
      <div class="text-zinc-400 text-sm text-center">
        More freedom and dozens of exclusive features with CRYPTOMI platform
      </div>
    </div>
    <Card class="py-3 px-4 flex-col gap-5">
      <div class="w-full mt-0.5 grid justify-items-center text-center">
        <div>
          <h3 class="text-white font-bold text-xl">Buy before launch!**</h3>
          <h4 class="text-white fint-bold text-sm items-center flex gap-2 justify-center">
            1 TON ~
            <span v-if="!isLoading">{{ ctmiPrice?.toFixed(4) }}</span
            ><span
              v-else
              class="w-[30px] h-[15px] shrink-0 inline-flex rounded-full animate-pulse bg-neutral-700"
            ></span>
            $CTMI
          </h4>
        </div>
      </div>
      <div class="w-full">
        <div class="relative mt-0.5 rounded-md shadow-sm">
          <div class="pointer-events-none absolute right-2 top-2 flex items-center pl-3">
            <span class="text-gray-500 sm:text-sm">
              <svg
                width="24"
                height="24"
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
            </span>
          </div>
          <input
            :disabled="isLoading"
            type="number"
            v-model="formData.tonAmount"
            id="ton"
            min="10"
            class="flex w-full p-2 text-sm text-zinc-100 bg-zinc-900 rounded-xl focus:outline-none h-10"
            placeholder="0.00"
          />
        </div>
      </div>
      <div class="w-full mt-0.5 grid justify-items-center">
        <div
          class="bg-green-500 text-white shrink-0 text-lg w-[32px] h-[32px] rounded-full flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M11 8L7 4m0 0L3 8m4-4v16m6-4l4 4m0 0l4-4m-4 4V4"
            />
          </svg>
        </div>
      </div>
      <div class="w-full">
        <div class="relative mt-0.5 rounded-md shadow-sm">
          <div class="pointer-events-none absolute right-2 top-1 flex items-center pl-3">
            <span class="text-gray-500 sm:text-sm">
              <img src="/images/assets/ctmi.png" class="w-8 h-8" />
            </span>
          </div>
          <input
            type="number"
            v-model="formData.ctmiAmount"
            disabled
            readonly
            id="ctmi"
            class="flex w-full p-2 text-sm text-zinc-100 bg-zinc-900 rounded-xl focus:outline-none h-10"
            placeholder="0.00"
          />
        </div>
      </div>
      <div class="w-full mt-0.5 grid justify-items-center">
        <template v-if="!userWallet">
          <span class="text-zinc-100">Please, connect your wallet </span>
        </template>
        <template v-else>
          <Button
            @click="transfer"
            :disabled="!formData.ctmiAmount || !formData.tonAmount || !account || isLoading"
            text="Buy now!*"
            :type="
              !formData.ctmiAmount || !formData.tonAmount || !account || isLoading
                ? 'secondary'
                : 'primary'
            "
          />
        </template>
      </div>
      <div class="w-full my-1 text-sm text-white">
        <h4>
          * Can also send TON to UQCV3YdlxazBZpIeb-7426nun1B-yyMrAtUNdl5zubWYfRQv or to cryptomi.ton
          from a decentralised wallet
        </h4>
        <h4>** Then Wait for <span class="line-through">Moon</span> Airdrop</h4>
      </div>
    </Card>
    <h2 class="font-bold text-5xl mt-5 text-white text-center">
      <span class="text-green-500 font-bold">CTMI</span> TOKENOMICS
    </h2>
    <div class="block">
      <swiper
        :slides-per-view="'auto'"
        :space-between="10"
        :loop="true"
        :effect="'creative'"
        :autoplay="{
          delay: 1000,
          disableOnInteraction: true
        }"
      >
        <swiper-slide
          class="!w-[280px] h-full flex flex-col"
          v-for="(item, i) in tokenomicTerms"
          :key="i"
        >
          <Card class="py-8 px-4 flex-col gap-5 text-zinc-100">
            <div class="font-bold text-xl h-[56px] text-center">
              {{ item.title }}
            </div>
            <div class="flex w-full flex-col gap-2">
              <div v-for="(data, j) in item.data" :key="j" class="flex w-full justify-between">
                <span class="text-slate-400">{{ data.name }}</span>
                <span>{{ data.value }}</span>
              </div>
            </div>
          </Card>
        </swiper-slide>
      </swiper>
      <div class="flex items-center mt-4 flex-col" v-if="tokenomicTerms.length > 1">
        <img class="w-[70px]" src="/images/slide.gif" />
      </div>
    </div>
    <h2 class="font-bold text-4xl mt-5 text-white text-center">
      An indispensable assistant in crypto
    </h2>
    <div class="block">
      <swiper
        :slides-per-view="'auto'"
        :space-between="10"
        :loop="true"
        :effect="'creative'"
        :autoplay="{
          delay: 1000,
          disableOnInteraction: true
        }"
      >
        <swiper-slide class="h-full flex flex-col" v-for="(item, i) in assistantTerms" :key="i">
          <Card class="py-8 px-4 flex-col gap-5 text-zinc-100">
            <div class="font-bold text-3xl h-[56px] text-center">
              {{ item.title }}
            </div>
            <div class="text-center">
              {{ item.description }}
            </div>
            <div class="flex flex-col gap-2">
              <div v-for="(image, i) in item.images" :key="i">
                <img :src="image" />
              </div>
            </div>
          </Card>
        </swiper-slide>
      </swiper>
      <div class="flex items-center mt-4 flex-col" v-if="assistantTerms.length > 1">
        <img class="w-[70px]" src="/images/slide.gif" />
      </div>
    </div>

    <Card class="py-3 px-4 flex-col gap-5 text-white hidden">
      <div class="flex flex-col items-center">
        <h2 class="font-bold text-5xl mt-5 tracking-tight">FAQ</h2>
        <p class="text-neutral-500 text-base mt-3">Frequenty asked questions</p>
        <div class="mt-5"></div>
      </div>
      <div class="grid divide-y divide-neutral-200 max-w-2xl w-full mx-auto mt-8">
        <div class="py-5 w-full" v-for="(item, i) in faqTerms" :key="i">
          <details class="group text-zinc-100">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>{{ item.title }}</span>
              <span class="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  shape-rendering="geometricPrecision"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="text-zinc-400 mt-3 group-open:animate-fadeIn">
              {{ item.description }}
            </p>
          </details>
        </div>
      </div>
    </Card>
  </div>
</template>
