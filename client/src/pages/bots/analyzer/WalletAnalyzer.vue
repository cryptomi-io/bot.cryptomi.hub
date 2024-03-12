<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { useAnalytics } from '@/composables/useAnalytics'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BackButton, useWebApp } from 'vue-tg'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const { initDataUnsafe } = useWebApp()
const { addTask, getTasks } = useAnalytics()

let chatId = 6754514128
if (import.meta.env.VITE_NODE_ENV !== 'development') {
  chatId = initDataUnsafe?.user?.id
}
const isLoading = ref(true)
const progressWidth = ref(0)
const tab = ref('completed')
const formData = ref({
  wallet: '',
  timePeriod: 30
})
const periods = [1, 7, 30, 60, 90]

const activeTasks = ref([])
const completedTasks = ref([])

onMounted(async () => {
  updateTasksList()
})

const updateTasksList = async () => {
  isLoading.value = true
  const response = await getTasks(chatId)
  if (response) {
    activeTasks.value = response.filter((item) => item.status === 'ACTIVE')
    completedTasks.value = response.filter((item) => item.status === 'COMPLETE')
  }
  isLoading.value = false
}

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
  if (response) {
    updateTasksList()
  }
  return
}

const prepareStatus = (status) => {
  if (status === 'ACTIVE') {
    return 'Pending'
  } else if (status === 'COMPLETE') {
    return 'Completed'
  }
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

      <Button text="Check wallet" type="primary" class="!w-full mt-2" :isLoading="isLoading" />
    </form>

    <div class="flex w-full gap-2 mt-4">
      <div
        @click="tab = 'completed'"
        :class="[
          'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
          tab === 'completed' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
        ]"
      >
        Completed
      </div>
      <div
        @click="tab = 'active'"
        :class="[
          'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
          tab === 'active' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
        ]"
      >
        Active
      </div>
    </div>
    <template v-if="tab === 'active'">
      <Card
        v-for="(item, i) in activeTasks"
        :key="i"
        class="py-3 px-5 flex-col text-start !items-start gap-2"
      >
        <div class="flex gap-2 items-start w-full justify-between">
          <div class="flex flex-col">
            <div class="text-xs text-zinc-400">Wallet address</div>
            <div class="text-md font-bold text-white break-all text-xs">
              {{ item?.wallet_address }}
            </div>
          </div>
          <div
            :class="[
              `text-xs text-neutral-800 font-light shrink-0 rounded-xl px-2 py-1`,
              item.status === 'ACTIVE' ? ` bg-yellow-500` : `bg-green-500`
            ]"
          >
            {{ prepareStatus(item.status) }}
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-xs text-zinc-400">
            {{ dayjs(item?.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
      </Card>
    </template>
    <template v-if="tab === 'completed'">
      <router-link v-for="(item, i) in completedTasks" :key="i" :to="`/bots/analyzer/${item.id}`">
        <Card class="py-3 px-5 flex-col text-start !items-start gap-2">
          <div class="flex gap-2 items-start w-full justify-between">
            <div class="flex flex-col">
              <div class="text-xs text-zinc-400">Wallet address</div>
              <div class="text-md font-bold text-white break-all text-xs">
                {{ item?.wallet_address }}
              </div>
            </div>
            <div
              :class="[
                `text-xs text-neutral-800 font-light shrink-0 rounded-xl px-2 py-1`,
                item.status === 'ACTIVE' ? ` bg-yellow-500` : `bg-green-500`
              ]"
            >
              {{ prepareStatus(item.status) }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-xs text-zinc-400">
              {{ dayjs(item?.created_at).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </Card>
      </router-link>
    </template>
  </div>
</template>
