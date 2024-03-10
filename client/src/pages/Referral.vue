<script setup>
import Card from '@/components/ui/Card.vue';
import { useUserStore } from '@/store/user';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
const user = useUserStore()

const isLoading = ref(false)

onMounted(() => {
  isLoading.value = true
  //FETCH USER INFO HERE IF didn't have before
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

const refLink = 'https://t.me/cryptomiHubBot/?start=ref-' + user.profile?.uuid
const copyLink = () => {
  const input = document.createElement('input')
  input.value = refLink
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <template v-if="isLoading">
      <Card class="py-3 px-4 flex-col">
        <div class="w-[50px] h-[50px] rounded-full animate-pulse bg-neutral-700"></div>
        <div class="h-4 bg-neutral-700 rounded w-20 mt-2 mb-2"></div>
        <div class="h-2 bg-neutral-700 rounded w-[50px]"></div>
      </Card>
      <Card class="py-3 px-4 flex-col gap-2">
        <div class="text-md text-white font-bold">Current referrals</div>
        <div
          v-for="i in 4"
          :key="i"
          class="flex justify-between w-full text-sm py-2 border-b border-zinc-600"
        >
          <div class="h-3 bg-neutral-700 rounded w-20"></div>
          <div class="h-3 bg-neutral-700 rounded w-32"></div>
        </div>
        <div
          class="flex border border-zinc-600 text-white mt-2 text-center justify-center rounded-2xl px-3 py-2 w-full"
        >
          Your current rank
        </div>
      </Card>
      <Card class="py-3 px-4 flex-col gap-2 hidden">
        <div class="text-md text-green-500 font-bold">Vip privelege</div>
        <div class="blur-sm w-full">
          <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
            <span class="text-zinc-300">USDT deposited</span> <span class="text-white"> 0</span>
          </div>
          <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
            <span class="text-zinc-300">Direct referrals</span> <span class="text-white"> 0</span>
          </div>
          <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
            <span class="text-zinc-300">Withdraw percentage</span>
            <span class="text-white"> 0</span>
          </div>
        </div>
        <div
          class="rounded-2xl mt-3 cursor-pointer bg-green-500 hover:bg-green-600 text-zinc-900 shrink-0 text-center justify-center px-3 py-2 w-full"
        >
          Coming soon
        </div>
      </Card>
      <div class="grid grid-cols-2 gap-2 hidden">
        <Card class="py-8 px-4 flex-col">
          <div class="h-8 bg-neutral-700 rounded w-20 mb-1"></div>
          <div class="h-2 bg-neutral-700 rounded w-[100px] mb-1"></div>
        </Card>
        <Card class="py-8 px-4 flex-col">
          <div class="h-8 bg-neutral-700 rounded w-20 mb-1"></div>
          <div class="h-2 bg-neutral-700 rounded w-[100px] mb-1"></div>
        </Card>
      </div>
    </template>
    <template v-else>
      <Card class="py-3 px-4 flex-col">
        <img
          :src="
            user?.profile?.avatar
              ? 'https://cryptomi.io' + user?.profile?.avatar
              : 'http://placeholder.co/300x300'
          "
          alt="placeholder"
          class="w-[50px] h-[50px] rounded-full"
        />
        <div class="text-md text-white font-bold mt-2">@{{ user?.profile?.nickname }}</div>
        <div class="text-sm text-zinc-400">
          Level:
          <span
            class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-500/10 dark:text-green-500"
          >
            <svg
              class="flex-shrink-0 size-3"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" x2="12" y1="2" y2="6" />
              <line x1="12" x2="12" y1="18" y2="22" />
              <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
              <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
              <line x1="2" x2="6" y1="12" y2="12" />
              <line x1="18" x2="22" y1="12" y2="12" />
              <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
              <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
            </svg>
            Soon
          </span>
        </div>
      </Card>
      <Card class="py-9 px-4 flex-col gap-2">
        <Icon icon="vaadin:piggy-bank-coin" class="w-10 h-10 text-green-500" />
        <div class="text-lg mt-1 text-white font-bold">Refer and Earn</div>
        <span class="text-zinc-300 text-center text-sm"
          >Refer your friends and earn $CTMI from each.
        </span>
        <div class="rounded-md overflow-hidden w-full flex mt-2">
          <input
            v-model="refLink"
            type="text"
            readonly="readonly"
            class="w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
          />
          <button @click="copyLink" class="bg-green-500 p-3 h-full">
            <Icon icon="material-symbols:content-copy" class="w-5 h-5 text-white" />
          </button>
        </div>
      </Card>
      <Card class="py-3 px-4 flex-col gap-2">
        <div class="text-md text-white font-bold">Current referrals</div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Referrals</span>
          <span class="text-white"> {{ user?.referral?.info?.referrals }}</span>
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Active referrals</span>
          <span class="text-white"> {{ user?.referral?.info?.active_referrals }}</span>
        </div>
        <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
          <span class="text-zinc-300">Claimed referrals</span>
          <span class="text-white"> {{ user?.referral?.info?.claimed_referrals }}</span>
        </div>
      </Card>
      <Card class="py-3 px-4 flex-col gap-2 hidden">
        <div class="text-md text-green-500 font-bold">Vip privelege</div>
        <div class="blur-sm w-full">
          <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
            <span class="text-zinc-300">USDT deposited</span> <span class="text-white"> 0</span>
          </div>
          <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
            <span class="text-zinc-300">Direct referrals</span> <span class="text-white"> 0</span>
          </div>
          <div class="flex justify-between w-full text-sm py-2 border-b border-zinc-600">
            <span class="text-zinc-300">Withdraw percentage</span>
            <span class="text-white"> 0</span>
          </div>
        </div>
        <div
          class="rounded-2xl mt-3 cursor-pointer bg-green-500 hover:bg-green-600 text-zinc-900 shrink-0 text-center justify-center px-3 py-2 w-full"
        >
          Coming soon
        </div>
      </Card>
      <div class="grid grid-cols-2 gap-2 hidden">
        <Card class="py-8 px-4 flex-col">
          <div class="text-2xl text-white font-bold">{{ user?.referral?.info?.value }} CTMI</div>
          <div class="text-sm text-zinc-400">Your value</div>
        </Card>
        <Card class="py-8 px-4 flex-col">
          <div class="text-2xl text-white font-bold">{{ user?.referral?.info?.daily }} CTMI</div>
          <div class="text-sm text-zinc-400">Daily value</div>
        </Card>
      </div>
      <Card class="py-3 px-4 flex-col gap-2 hidden">
        <div class="text-md text-white font-bold">Rank comissions</div>
        <div
          class="blur-sm flex justify-between items-center w-full text-sm py-2 border-b border-zinc-600"
        >
          <div class="flex items-center gap-2">
            <Icon icon="clarity:blocks-group-line" class="text-green-500 w-5 h-5" />
            <span class="text-zinc-300">Staking</span>
          </div>
          <span class="text-white bg-zinc-900 p-1 text-xs rounded-md"
            >{{ user?.referral?.rank_info?.staking.toFixed(2) }}%</span
          >
        </div>
        <div
          class="blur-sm flex justify-between items-center w-full text-sm py-2 border-b border-zinc-600"
        >
          <div class="flex items-center gap-2">
            <Icon icon="ph:money" class="text-green-500 w-5 h-5" />
            <span class="text-zinc-300">Deposit</span>
          </div>
          <span class="text-white bg-zinc-900 p-1 text-xs rounded-md">
            {{ user?.referral?.rank_info?.deposit.toFixed(2) }}%</span
          >
        </div>
        <div
          class="blur-sm flex justify-between items-center w-full text-sm py-2 border-b border-zinc-600"
        >
          <div class="flex items-center gap-2">
            <Icon icon="mingcute:transfer-3-line" class="text-green-500 w-5 h-5" />
            <span class="text-zinc-300">Trade</span>
          </div>
          <span class="text-white bg-zinc-900 p-1 text-xs rounded-md">
            {{ user?.referral?.rank_info?.trade.toFixed(2) }}%</span
          >
        </div>
        <div class="blur-sm flex justify-between items-center w-full text-sm py-2">
          <div class="flex items-center gap-2">
            <Icon icon="bx:bot" class="text-green-500 w-5 h-5" />
            <span class="text-zinc-300">Bot investment</span>
          </div>
          <span class="text-white bg-zinc-900 p-1 text-xs rounded-md">
            {{ user?.referral?.rank_info?.bot_investment.toFixed(2) }}%</span
          >
        </div>
        <div class="blur-sm flex justify-between items-center w-full text-sm py-2">
          <div class="flex items-center gap-2">
            <Icon icon="humbleicons:coins" class="text-green-500 w-5 h-5" />
            <span class="text-zinc-300">Token after purchase</span>
          </div>
          <span class="text-white bg-zinc-900 p-1 text-xs rounded-md">
            {{ user?.referral?.rank_info?.token_after_purchase.toFixed(2) }}%</span
          >
        </div>
      </Card>
    </template>
  </div>
</template>
../store/user