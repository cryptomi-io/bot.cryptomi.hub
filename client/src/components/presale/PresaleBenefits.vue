<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import Card from '@/components/ui/Card.vue'

import 'swiper/css'

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
</script>
<template>
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
</template>
