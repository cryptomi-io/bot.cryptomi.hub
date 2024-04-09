<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useTon } from '@/composables/useTon'
import { useTonWalletStore } from '@/store/wallets/ton-wallet'
import { TonConnectUI } from '@tonconnect/ui'
import { Address, TonClient } from 'ton'

const currentPlan = ref('annually')
const TonWalletStore = useTonWalletStore()

const { sendTransaction } = useTon()
const plans = [
  {
    slug: 'annually',
    name: 'Annually',
    price: '29.99 $/month'
  },
  {
    slug: 'monthly',
    name: 'Monthly',
    price: '45.75 $/month'
  }
]
const premiumBenefits = [
  {
    icon: '/images/premium/1.png',
    title: 'Participation in platform management',
    text: 'Giving VIP users the right to vote in key decisions related to the development and management of the DeFi platform, through voting mechanisms or DAOs.'
  },
  {
    icon: '/images/premium/2.png',
    title: 'Exclusive tools for analysis and research',
    text: 'Access to professional tools and resources for market analysis, project research and smart contract auditing to help users make informed investment decisions.'
  },
  {
    icon: '/images/premium/3.png',

    title: 'Free ENS address for your wallet for 3 years',
    text: 'As a Crypto Premium member, you receive the exclusive right to register your own ENS (Ethereum Name Service) address free of charge for three years. This allows you to use an easy-to-remember name instead of a standard Ethereum wallet address, making it easier to exchange addresses and increasing your visibility in the Ethereum ecosystem. The platform covers all associated costs, giving you a convenient and personalized way to manage your DeFi assets.'
  }
]

const transfer = async () => {
  const walletTo = 'UQCV3YdlxazBZpIeb-7426nun1B-yyMrAtUNdl5zubWYfRQv'
  const address = Address.parse(walletTo)

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
    messages: [
      {
        address: walletTo,
        // address: address.toRaw(),
        amount: '200000000'
        // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
      },
    ]
  }

  try {
    const result = await window.tonConnectUI.sendTransaction(transaction)

    alert('Transaction was sent successfully', result)
  } catch (e) {
    console.error(e)
  }
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
          <h4 class="text-white fint-bold text-sm">10 TON = 35 000 $CTMI</h4>
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
            type="text"
            name="ton"
            id="ton"
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
            type="text"
            name="ctmi"
            id="ctmi"
            class="flex w-full p-2 text-sm text-zinc-100 bg-zinc-900 rounded-xl focus:outline-none h-10"
            placeholder="0.00"
          />
        </div>
      </div>
      <div class="w-full mt-0.5 grid justify-items-center">
        <button
          @click="transfer"
          class="group relative h-10 w-32 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
        >
          Buy now!*
          <div
            class="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"
          ></div>
        </button>
      </div>
      <div class="w-full my-1 text-sm text-white">
        <h4>
          * Can also send TON to UQCV3YdlxazBZpIeb-7426nun1B-yyMrAtUNdl5zubWYfRQv or to cryptomi.ton
          from a decentralised wallet
        </h4>
        <h4>** Then Wait for <span class="line-through">Moon</span> Airdrop</h4>
      </div>
    </Card>
    <Card class="py-3 px-4 flex-col gap-5 text-white">
      <div class="flex flex-col items-center">
        <h2 class="font-bold text-5xl mt-5 tracking-tight">FAQ</h2>
        <p class="text-neutral-500 text-base mt-3">Frequenty asked questions</p>
      </div>
      <div class="grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8">
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> What is a SAAS platform?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              SAAS platform is a cloud-based software service that allows users to access and use a
              variety of tools and functionality.
            </p>
          </details>
        </div>
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> How does billing work?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              We offers a variety of billing options, including monthly and annual subscription
              plans, as well as pay-as-you-go pricing for certain services. Payment is typically
              made through a credit card or other secure online payment method.
            </p>
          </details>
        </div>
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> Can I get a refund for my subscription?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              We offers a 30-day money-back guarantee for most of its subscription plans. If you are
              not satisfied with your subscription within the first 30 days, you can request a full
              refund. Refunds for subscriptions that have been active for longer than 30 days may be
              considered on a case-by-case basis.
            </p>
          </details>
        </div>
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> How do I cancel my subscription?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              To cancel your We subscription, you can log in to your account and navigate to the
              subscription management page. From there, you should be able to cancel your
              subscription and stop future billing.
            </p>
          </details>
        </div>
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> Can I try this platform for free?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              We offers a free trial of its platform for a limited time. During the trial period,
              you will have access to a limited set of features and functionality, but you will not
              be charged.
            </p>
          </details>
        </div>
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> How do I access documentation?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              Documentation is available on the company's website and can be accessed by logging in
              to your account. The documentation provides detailed information on how to use the ,
              as well as code examples and other resources.
            </p>
          </details>
        </div>
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> How do I contact support?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              If you need help with the platform or have any other questions, you can contact the
              company's support team by submitting a support request through the website or by
              emailing support@We.com.
            </p>
          </details>
        </div>
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> Do you offer any discounts or promotions?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              We may offer discounts or promotions from time to time. To stay up-to-date on the
              latest deals and special offers, you can sign up for the company's newsletter or
              follow it on social media.
            </p>
          </details>
        </div>
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <span> How do we compare to other similar services?</span>
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
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
              This platform is a highly reliable and feature-rich service that offers a wide range
              of tools and functionality. It is competitively priced and offers a variety of billing
              options to suit different needs and budgets.
            </p>
          </details>
        </div>
      </div>
    </Card>
  </div>
</template>
