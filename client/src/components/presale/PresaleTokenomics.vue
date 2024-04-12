<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import Card from '@/components/ui/Card.vue'

import 'swiper/css'

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
</script>
<template>
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
</template>
