<script setup>
const bots = [
  {
    cover: '/images/assets/bot_banner.webp',
    icon: '/images/assets/bot_logo.webp',
    title: '@cryptomi_token_anylyzer',
    description: 'BOT TOKEN ANALYZER',
    path: 'https://t.me/cryptomi_token_anylyzer',
    isExternal: true,
    released: false
  },
  {
    cover: '/images/assets/bot_banner_dex.webp',
    icon: '/images/assets/bot_logo_dex.webp',
    title: '@cryptomi_wallet_anylyzer',
    description: 'BOT TOKEN ANALYZER',
    path: '/bots/wallet-analyzer',
    isExternal: false,
    released: true
  }
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="grid grid-cols-1 gap-1">
      <div
        v-for="(bot, i) in bots"
        :key="i"
        class="bg-neutral-800 rounded-xl overflow-hidden flex flex-col"
      >
        <div class="relative h-[120px] flex flex-col justify-end items-center">
          <img :src="bot.cover" class="absolute w-full h-full object-cover inset-0 z-10" />
          <div class="p-[3px] rounded-full border border-gray-700 z-20 relative -bottom-5">
            <img :src="bot.icon" class="w-16 h-16 rounded-full" />
          </div>
        </div>
        <div class="pt-8 pb-8 py-2 flex flex-col items-center">
          <div class="font-bold text-xs mb-2">
            {{ bot.description }}
          </div>
          <template v-if="bot.released">
            <router-link :to="bot.path">
              <div class="bg-green-500 text-zinc-900 p-1 text-xs rounded-3xl px-3">Try it now</div>
            </router-link>
          </template>
          <template v-else>
            <div class="bg-green-500 text-zinc-900 p-1 text-xs rounded-3xl px-3">Soon</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
