<script setup>
import MarketTokens from '@/components/markets/MarketTokens.vue'
import UserBalance from '@/components/user/UserBalance.vue'
import UserShortInfo from '@/components/user/UserShortInfo.vue'
import MarketMarquee from '@/components/markets/MarketMarquee.vue'

// import UserTransactions from '@/components/user/UserTransactions.vue'
</script>

<template>
  <div class="pt-10">
    <MarketMarquee class="fixed top-0 left-0" />
    <div class="flex flex-col gap-3">
      <UserShortInfo />
      <UserBalance />
      <MarketTokens />
      <!-- <UserTransactions /> -->
    </div>
  </div>
</template>
