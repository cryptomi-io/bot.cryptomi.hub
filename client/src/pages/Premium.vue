<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const currentPlan = ref('annually')

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
</script>

<template>
  <div class="flex flex-col gap-5">
    <img src="/images/premium.png" alt="premium" />
    <div class="flex flex-col gap-1 items-center">
      <div class="font-bold text-white text-xl">CRYPTOMI Premium</div>
      <div class="text-zinc-400 text-sm text-center">
        More freedom and dozens of exclusive features with CRYPTOMI Premium subscription
      </div>
    </div>
    <Card class="blur-sm py-3 px-4 flex-col gap-5">
      <div
        v-for="(plan, i) in plans"
        :key="i"
        class="flex w-full justify-between items-center"
        @click="currentPlan = plan.slug"
      >
        <div class="flex items-center gap-2">
          <Icon
            v-if="plan.slug === currentPlan"
            icon="icon-park-solid:check-one"
            class="w-8 h-8 text-white"
          />
          <div v-else class="w-8 h-8 rounded-full border-2 border-zinc-400"></div>
          <div class="text-zinc-100 text-sm">{{ plan.name }}</div>
        </div>
        <div class="text-zinc-400 text-sm">{{ plan.price }}</div>
      </div>
    </Card>
    <Card class="blur-sm py-3 px-4 flex-col">
      <div
        v-for="(benefit, i) in premiumBenefits"
        :key="i"
        :class="[
          'flex w-full items-start gap-2 py-3 ',
          i === premiumBenefits.length - 1 ? '' : 'border-b border-zinc-600'
        ]"
      >
        <img :src="benefit.icon" class="w-10 h-10" />
        <div class="flex flex-col">
          <div class="text-zinc-100 font-bold text-sm">{{ benefit.title }}</div>
          <div class="text-zinc-400 text-xs">{{ benefit.text }}</div>
        </div>
      </div>
    </Card>
    <hr class="h-[1px] bg-zinc-600 border-0" />
    <div class="text-sm flex flex-col gap-1">
      <div class="text-zinc-100 font-bold">About СRYPTOMI Premium</div>
      <div class="text-zinc-400">
        By subscribing to our cryptocurrency exchange, you not only enter the world of
        cryptocurrencies but also gain access to unique advantages that make your trading more
        successful and profitable. Our subscribers enjoy advantages such as exclusive information
        access, reduced fees, education, analytics, and much more. Join us today and open the doors
        to a world of opportunities offered by our cryptocurrency exchange
      </div>
    </div>
    <hr class="h-[1px] bg-zinc-600 border-0" />
    <p class="text-xs text-zinc-400">
      By subscribing to CRYPTOMI Premium, you accept the terms of the
      <span class="text-white">CRYPTOMI User Agreement.</span>
    </p>
    <Button text="Coming soon" type="primary" size="md" class="shrink-0 mt-10" />
  </div>
</template>
