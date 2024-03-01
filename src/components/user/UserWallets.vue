<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { useWalletsStore } from '@/store/wallets'
import { ref, onMounted, computed } from 'vue'
const walletsStore = useWalletsStore()
const wallets = computed(() => walletsStore.list || {})
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await walletsStore.fetchWallets()
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold text-lg">Assets</div>
    <div class="flex flex-col gap-1">
      <!-- PLACEHOLDER -->
      <template v-if="isLoading">
        <Card v-for="i in 4" :key="i" class="py-3 px-4">
          <div class="flex gap-2 items-center">
            <div class="rounded-full animate-pulse bg-neutral-700 h-10 w-10"></div>
            <div class="flex flex-col animate-pulse">
              <div class="h-4 bg-neutral-700 rounded w-20"></div>
              <div class="h-2 bg-neutral-700 mt-1 rounded w-12"></div>
            </div>
          </div>
          <div class="flex flex-col items-end animate-pulse">
            <div class="h-4 bg-neutral-700 rounded w-20"></div>
            <div class="h-2 bg-neutral-700 mt-1 rounded w-10"></div>
          </div>
        </Card>
      </template>
      <!-- CONTENT -->

      <template v-else>
        <Card v-for="(item, i) in wallets" :key="i" class="py-3 px-4">
          <div class="flex gap-2 items-center">
            <img
              :src="'https://cryptomi.io/img/crypto/'+item?.currency?.toLowerCase()+'.png'"
              alt="placeholder"
              class="w-10 h-10 rounded-full"
            />
            <div class="flex flex-col">
              <div class="text-zinc-100 font-bold text-sm">{{ item?.currency }}</div>
              <div class="text-zinc-400 text-xs">
                {{ item?.currency === 'CTMI' ? item?.chain : item?.balance + ' ' + item?.currency }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <Button
              v-if="item?.currency === 'CTMI'"
              text="Info"
              type="primary"
              size="sm"
              class="shrink-0 mt-1"
            />
            <div v-else class="text-zinc-500 text-sm">
              <span class="text-zinc-100 font-bold">${{ item?.price }}</span>
            </div>
          </div>
        </Card>
      </template>
    </div>
  </div>
</template>
