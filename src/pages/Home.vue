<script setup>
import UserBalance from '@/components/user/UserBalance.vue'
import UserShortInfo from '@/components/user/UserShortInfo.vue'
// import UserTransactions from '@/components/user/UserTransactions.vue'
import UserWallets from '@/components/user/UserWallets.vue'
</script>

<template>
  <div class="flex flex-col gap-3">
    <UserShortInfo />
    <UserBalance />
    <UserWallets />
    <!-- <UserTransactions /> -->
  </div>
</template>
