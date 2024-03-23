<script setup>
import Button from '@/components/ui/Button.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BackButton, useWebApp } from 'vue-tg'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const { initDataUnsafe } = useWebApp()

let chatId = 6754514128
if (import.meta.env.VITE_NODE_ENV !== 'development') {
  chatId = initDataUnsafe?.user?.id
}
const isLoading = ref(false)
const progressWidth = ref(0)
const formData = ref({
  wallet: '',
  contractAddress: 30
})
const periods = [1, 7, 30, 60]

const formHandleSubmit = async () => {
  isLoading.value = true
  isLoading.value = false
}

function handleBackButton() {
  router.back()
}
</script>

<template>
  <BackButton @click="handleBackButton" />
  <div v-if="isLoading" class="progress-bar fixed top-0 left-0 h-1 w-full bg-zinc-900">
    <div
      class="h-1 bg-green-400 transition-all duration-600"
      :style="{ width: progressWidth + '%' }"
    ></div>
  </div>
  <div class="flex flex-col gap-3">
    <form class="flex flex-col gap-4" @submit.prevent="formHandleSubmit">
      <div class="flex flex-col gap-2">
        <label>Choose time period</label>
        <div class="flex w-full gap-2">
          <div
            v-for="timePeriod in periods"
            @click="formData.timePeriod = timePeriod"
            :key="timePeriod"
            :class="[
              'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
              timePeriod === formData.timePeriod
                ? 'bg-green-500 text-zinc-900'
                : 'bg-zinc-900 text-zinc-400'
            ]"
          >
            {{ timePeriod }}d
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label>Enter contract address</label>
        <input
          v-model="formData.contractAddress"
          type="text"
          placeholder="Token contract address"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
        />
      </div>

      <Button text="Soon" disabled type="secondary" class="!w-full mt-2" :isLoading="isLoading" />
    </form>
  </div>
</template>
