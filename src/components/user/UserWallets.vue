<script setup>
import Card from '@/components/ui/Card.vue'
import { useDexChains } from '@/store/dextools/chains'
import { useGCoinsStore } from '@/store/gecko/coins'
import { computed, onMounted, ref } from 'vue'

const GCoinsStore = useGCoinsStore()
const DexChains = useDexChains()

const TrendingList = computed(() =>
  TrendingListOpen.value ? GCoinsStore.coinsTrending : GCoinsStore.coinsTrending.slice(0, 5) || []
)
const ChainsList = computed(() => DexChains.list || [])
const ChainsListOpen = ref(false)
const TrendingListOpen = ref(false)

const isLoading = ref(false)
onMounted(async () => {
  isLoading.value = true
  await GCoinsStore.getTrending()
  await DexChains.getChains()
  console.log(ChainsList.value)
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold text-lg">#Chains</div>
    <template v-if="isLoading">
      <Card class="py-3 px-4">
        <ul class="grid grid-cols-4 gap-2 px-1 w-full">
          <li v-for="i in 8" :key="i" class="flex items-center flex-col">
            <div class="rounded-full animate-pulse bg-neutral-700 h-10 w-10"></div>
            <div class="h-2 bg-neutral-700 animate-pulse mt-1 rounded w-10"></div>
          </li>
        </ul>
      </Card>
    </template>
    <template v-else>
      <Card
        :class="[
          'py-3 px-4 max-h-[140px] overflow-hidden !items-start',
          ChainsListOpen ? 'max-h-full' : ''
        ]"
      >
        <ul class="grid grid-cols-4 gap-2 px-1 w-full">
          <li v-for="(item, i) in ChainsList" :key="i" class="flex items-center flex-col">
            <img
              :src="'https://www.dextools.io/resources/chains/med/' + item?.id + '.png'"
              class="rounded-full w-10 h-10 object-cover"
            />
            <h5 class="text-zinc-400 text-xs">{{ item?.name }}</h5>
          </li>
        </ul>
      </Card>
      <Card
        v-if="!isLoading"
        class="bg-neutral-700 py-2 px-4"
        @click="ChainsListOpen = !ChainsListOpen"
      >
        <div
          class="flex gap-2 items-center font-medium text-sm text-center justify-center cursor-pointer m-auto"
        >
          {{ ChainsListOpen ? 'Hide' : 'Show more' }}
        </div>
      </Card>
    </template>
    <div class="font-bold text-lg">#DeFi Treding</div>
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
        <!-- component -->

        <!-- component -->
        <Card v-for="(item, i) in TrendingList" :key="i" class="py-3 px-4">
          <div class="flex gap-2 items-center">
            <img :src="item?.small" alt="placeholder" class="w-10 h-10 rounded-full" />
            <div class="flex flex-col">
              <div class="text-zinc-100 font-bold text-sm">{{ item?.name }}</div>
              <div class="text-zinc-400 text-xs" v-html="item?.data?.price"></div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="text-zinc-500 text-sm">
              <span
                v-if="item?.data?.price_change_percentage_24h?.usd > 0"
                :class="['text-green-500 font-bold']"
                >{{ item?.data?.price_change_percentage_24h?.usd.toFixed(3) }} $</span
              >
              <span v-else :class="['text-red-500 font-bold']"
                >{{ item?.data?.price_change_percentage_24h?.usd.toFixed(3) }} $</span
              >
            </div>
          </div>
        </Card>
        <Card class="bg-neutral-700 py-2 px-4" @click="TrendingListOpen = !TrendingListOpen">
          <div
            class="flex gap-2 items-center font-medium text-sm text-center justify-center cursor-pointer m-auto"
          >
            {{ TrendingListOpen ? 'Hide' : 'Show more' }}
          </div>
        </Card>
      </template>
    </div>
  </div>
</template>
