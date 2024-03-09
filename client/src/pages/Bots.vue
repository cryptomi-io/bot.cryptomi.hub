<script setup>
const bots = [
  {
    cover: '/images/bots/bot_token.png',
    icon: '/images/bots/bot_token_icon.png',
    title: 'BOT TOKEN ANALYZER',
    path: '',
    released: false
  },
  {
    cover: '/images/bots/bot_wallet.png',
    icon: '/images/bots/bot_wallet_icon.png',
    title: 'BOT TOKEN ANALYZER',
    path: '/bots/analyzer',
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
        <div class="relative w-full" style="padding-bottom: 50%">
          <img :src="bot.cover" class="top-0 absolute w-full h-full object-cover" />
          <img :src="bot.icon" class="w-16 h-16 rounded-full absolute -bottom-4 left-5" />
        </div>

        <div class="pt-10 pb-6 py-2 px-3 flex justify-between items-center">
          <div class="font-bold text-md">
            {{ bot.title }}
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
