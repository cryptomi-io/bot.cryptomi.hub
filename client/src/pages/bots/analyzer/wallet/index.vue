<script setup>
import Button from '@/components/ui/Button.vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BackButton, useWebApp } from 'vue-tg'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const { initDataUnsafe } = useWebApp()
const { addTask } = useAnalytics()

let chatId = 6754514128
if (import.meta.env.VITE_NODE_ENV !== 'development') {
  chatId = initDataUnsafe?.user?.id
}
const isLoading = ref(false)
const progressWidth = ref(0)
const formData = ref({
  wallet: '',
  timePeriod: 30
})
const periods = [1, 7, 30, 60]

const formHandleSubmit = async () => {
  isLoading.value = true
  if (!formData.value.wallet || !formData.value.timePeriod) {
    toast('Please enter the wallet', {
      autoClose: 3000,
      type: 'warning',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    }) // ToastOptions
    isLoading.value = false
    router.push({ name: 'bots.analyzer' })
    return
  }

  const response = await addTask(formData.value.wallet, formData.value.timePeriod, chatId)

  toast(response ? 'Analyze task is created' : 'Task already created', {
    autoClose: 3000,
    type: response ? 'success' : 'warning',
    position: 'top-right',
    theme: 'dark',
    toastStyle: 'top:10px'
  }) // ToastOptions
  return
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
        <label>Enter user wallet</label>
        <input
          v-model="formData.wallet"
          type="text"
          placeholder="0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
        />
      </div>

      <Button text="Create task" type="primary" class="!w-full mt-2" :isLoading="isLoading" />
    </form>
  </div>
</template>
