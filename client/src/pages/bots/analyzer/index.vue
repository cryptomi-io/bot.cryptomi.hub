<script setup>
import Card from '@/components/ui/Card.vue'
import dayjs from 'dayjs'
import { useAnalytics } from '@/composables/useAnalytics'
import { useWebApp } from 'vue-tg'
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'
const { initDataUnsafe } = useWebApp()
const router = useRouter()

const { getTasks } = useAnalytics()
const generalTab = ref('wallet')
const taskTab = ref('completed')
const addButtonDropdownOpen = ref(false)
const isLoading = ref(true)

let chatId = 6754514128
if (import.meta.env.VITE_NODE_ENV !== 'development') {
  chatId = initDataUnsafe?.user?.id
}

const activeTasks = ref([])
const completedTasks = ref([])

onMounted(async () => {
  updateTasksList()
})
const prepareStatus = (status) => {
  if (status === 'ACTIVE') {
    return 'Pending'
  } else if (status === 'COMPLETE') {
    return 'Completed'
  }
}

const updateTasksList = async () => {
  isLoading.value = true
  const response = await getTasks(chatId)
  if (response) {
    activeTasks.value = response.filter((item) => item.status === 'ACTIVE')
    completedTasks.value = response.filter((item) => item.status === 'COMPLETE')
  }
  isLoading.value = false
}
function handleBackButton() {
  router.back()
}
</script>
<template>
  <BackButton @click="handleBackButton" />
  <div class="flex justify-between items-center mb-3">
    <div class="font-bold text-lg text-white">#Bot Analyzer Tasks</div>
    <div class="relative">
      <div
        @click="addButtonDropdownOpen = !addButtonDropdownOpen"
        class="bg-green-500 text-zinc-900 shrink-0 text-lg w-[40px] h-[40px] rounded-full flex items-center justify-center"
      >
        +
      </div>
      <div
        v-if="addButtonDropdownOpen"
        class="flex w-[180px] z-40 absolute right-0 top-[40px] flex-col rounded-md bg-zinc-800 text-zinc-200 py-1"
      >
        <router-link
          :to="{ name: 'bots.analyzer.wallet' }"
          class="py-2 px-3 border-b border-zinc-700"
        >
          Wallet analyze
        </router-link>
        <router-link :to="{ name: 'bots.analyzer.token' }" class="py-2 px-3 border-zinc-700">
          Token analyze
        </router-link>
      </div>
    </div>
  </div>
  <div class="flex w-full overflow-hidden">
    <div class="flex items-center justify-between overflow-x-auto relative w-full">
      <div
        class="flex w-full justify-center px-7 py-2 z-10 border-b relative"
        :class="['', generalTab === 'wallet' ? 'border-green-500 text-white' : 'border-zinc-500']"
        @click="generalTab = 'wallet'"
      >
        Wallet
      </div>
      <div
        class="flex w-full justify-center px-7 py-2 z-10 border-b relative"
        :class="['', generalTab === 'token' ? 'border-green-500 text-white' : 'border-zinc-500']"
        @click="generalTab = 'token'"
      >
        Token
      </div>

      <div class="bg-zinc-500 absolute h-[1px] w-full bottom-0 z-0"></div>
    </div>
  </div>
  <template v-if="generalTab === 'wallet'">
    <div>
      <div class="flex w-full gap-2 my-4">
        <div
          @click="taskTab = 'completed'"
          :class="[
            'px-2 py-1 text-sm text-center cursor-pointer rounded-xl',
            taskTab === 'completed' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
          ]"
        >
          Completed
        </div>
        <div
          @click="taskTab = 'active'"
          :class="[
            'px-2 py-1 text-sm text-center cursor-pointer rounded-xl',
            taskTab === 'active' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
          ]"
        >
          Active
        </div>
      </div>
      <template v-if="!activeTasks.length && !completedTasks.length">
        <div class="flex flex-col gap-3 items-center justify-center">
          <div class="py-40 text-2xl text-zinc-400">Task list is empty</div>
        </div>
      </template>
      <template v-else>
        <template v-if="taskTab === 'active'">
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
        <template v-if="taskTab === 'completed'">
          <router-link
            v-for="(item, i) in completedTasks"
            :key="i"
            :to="`/bots/analyzer/wallet/${item.id}`"
          >
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
      </template>
    </div>
  </template>
  <template v-if="generalTab === 'token'">
    <div class="flex flex-col gap-3 items-center justify-center">
      <div class="py-40 text-2xl text-zinc-400">Task list is empty</div>
    </div>
  </template>
</template>
