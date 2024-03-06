<script setup>
import UserBalance from '@/components/user/UserBalance.vue'
import UserShortInfo from '@/components/user/UserShortInfo.vue'
import Notyfi from '@/components/user/Notify.vue'
import UserWallets from '@/components/user/UserWallets.vue'
</script>

<template>
  
  <div class="flex flex-col gap-3">
    <Notify />
    <UserShortInfo />
    <UserBalance />
    <UserWallets />
  </div>
</template>
