<script setup>
import Card from '@/components/ui/Card.vue';
import { useDexChains } from '@/store/dextools/chains';
//import { useGCoinsStore } from '@/store/gecko/coins'
import { computed, onMounted, reactive, ref, watch } from 'vue';

//const GCoinsStore = useGCoinsStore()
const DexChains = useDexChains()

/**const TrendingList = computed(() =>
  TrendingListOpen.value ? GCoinsStore.coinsTrending : GCoinsStore.coinsTrending.slice(0, 5) || []
)**/
const tokensForView = 8
const isGainersOpen = ref(false)
const isLosersOpen = ref(false)
const loadImage = ref(true)
const ChainsList = computed(() => DexChains.list || [])

const Gainers = computed(() => {
  if (isGainersOpen.value) {
    return DexChains.gainers || []
  }
  return DexChains.gainers.slice(0, tokensForView) || []
})

const Losers = computed(() => {
  if (isLosersOpen.value) {
    return DexChains.losers || []
  }
  return DexChains.losers.slice(0, tokensForView) || []
})

//const HotPools = ref(false)

const isLoading = ref(true)

const tab = ref('gainers')
const currentChain = ref('ether')

const imageStatus = reactive({});

const handleImgLoad = (id) => {
  imageStatus[id] =  true;
};

const handleImgError = (id) => {
  imageStatus[id] =  false;
};

onMounted(async () => {
  isLoading.value = true
  //здесь надо доработать на получение по сети
  if (!DexChains.gainers.length) {
    DexChains.getGainers(currentChain.value)
  }
  if (!DexChains.losers.length) {
    DexChains.getLosers(currentChain.value)
  }
  isLoading.value = false
})
watch(currentChain, async (newVal) => {
  isLoading.value = true
  DexChains.getGainers(newVal)
  DexChains.getLosers(newVal)
  
  isLoading.value = false
})
</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold text-lg">#Chains</div>
    <template v-if="isLoading">
      <Card class="py-3 px-4">
        <ul class="grid grid-cols-4 gap-2 px-1 w-full">
          <li v-for="i in 4" :key="i" class="flex items-center flex-col">
            <div class="rounded-full animate-pulse bg-neutral-700 h-10 w-10"></div>
            <div class="h-2 bg-neutral-700 animate-pulse mt-1 rounded w-10"></div>
          </li>
        </ul>
      </Card>
    </template>
    <template v-else>
      <Card class="py-3 px-4 max-h-[140px] overflow-hidden !items-start">
        <ul class="grid grid-cols-4 gap-2 px-1 w-full">
          <li
            v-for="(item, i) in ChainsList"
            :key="i"
            @click="currentChain = item?.id"
            class="flex items-center flex-col"
          >
            <img
              v-if="currentChain != item?.id"
              :src="'/images/chains/' + item?.id + '.png'"
              class="rounded-full w-10 h-10 object-cover border-2 grayscale"
            />
            <img
              v-else
              :src="'/images/chains/' + item?.id + '.png'"
              class="rounded-full w-10 h-10 object-cover border-2"
            />
            <h5 class="text-zinc-400 text-xs mt-2">{{ item?.name }}</h5>
          </li>
        </ul>
      </Card>
    </template>
    <!-- TABS -->
    <!-- PLACEHOLDER -->
    <template v-if="isLoading">
      <div class="flex w-full gap-2 mt-4">
        <div class="rounded-xl w-full animate-pulse bg-neutral-700 h-10 w-10"></div>
        <div class="rounded-xl w-full animate-pulse bg-neutral-700 h-10 w-10"></div>
      </div>
    </template>
    <template v-else>
      <div class="flex w-full gap-2 mt-4">
        <div
          @click="tab = 'gainers'"
          :class="[
            'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
            tab === 'gainers' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
          ]"
        >
          #Tomi Gainers
        </div>
        <div
          @click="tab = 'losers'"
          :class="[
            'w-full  p-2 text-sm text-center cursor-pointer rounded-xl',
            tab === 'losers' ? 'bg-green-500 text-zinc-900' : 'bg-zinc-900 text-zinc-400'
          ]"
        >
          #Tomi Losers
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-1" v-if="tab === 'gainers'">
      <!-- PLACEHOLDER -->
      <template v-if="isLoading">
        <Card v-for="i in tokensForView" :key="i" class="py-3 px-4">
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
        <!-- This is an example component -->
        <router-link
          v-for="(item, i) in Gainers"
          :key="i"
          :to="`/dex/${currentChain}/${item?.token?.id}`"
        >
          <Card class="py-3 px-4">
            <div class="flex gap-2 items-center">
              <span> #{{ item?.rank }}</span>
              <div class="relative inline-block">
                <img
                  class="inline-block w-10 h-10 rounded-full"
                  :src="
                    'https://www.dextools.io/resources/tokens/logos/ether/' +
                    item?.token?.id +
                    '.png'
                  "
                  alt="Image Description"
                  @load="handleImgLoad(i)"
                  @error="handleImgError(i)"
                  v-if="imageStatus[i]"
                />
                <div v-else class="inline-flex items-center justify-center w-12 h-12 text-xl text-white bg-indigo-500 rounded-full">
                  {{ item?.pair.substr(0,1) }}
                </div>
                <span
                  class="absolute bottom-1 end-1 block p-1 rounded-full transform translate-y-1/3 translate-x-1/3 border-1 w-5 h-5"
                >
                  <img :src="'/images/chains/' + currentChain + '.png'" alt="placeholder" />
                </span>
              </div>
              
                 {{ console.log() }}           
              <div class="flex flex-col">
                <div class="text-zinc-100 font-bold text-sm">
                  {{ item?.pair }}
                </div>
                <div class="text-zinc-400 text-xs" v-html="item?.price.toFixed(8)"></div>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <div class="text-zinc-500 text-sm">
                <span :class="['text-green-500 font-bold text-sm']"
                  >+ {{ item?.variation24h.toFixed(2) }}%</span
                >
              </div>
            </div>
          </Card>
        </router-link>

        <Card class="bg-neutral-700 py-2 px-4" @click="isGainersOpen = !isGainersOpen">
          <div
            class="flex gap-2 items-center font-medium text-sm text-center justify-center cursor-pointer m-auto"
          >
            {{ isGainersOpen ? 'Hide' : 'Show more' }}
          </div>
        </Card>
      </template>
    </div>

    <div class="flex flex-col gap-1" v-if="tab === 'losers'">
      <!-- PLACEHOLDER -->
      <template v-if="isLoading">
        <Card v-for="i in tokensForView" :key="i" class="py-3 px-4">
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
        <!-- This is an example component -->
        <router-link
          v-for="(item, i) in Losers"
          :key="i"
          :to="`/dex/${currentChain}/${item?.token?.id}`"
          class="w-full"
        >
          <Card class="py-3 px-4">
            <div class="flex gap-2 items-center w-full">
              <span> #{{ item?.rank }}</span>
              <div class="relative inline-block">
                <img
                  class="inline-block w-10 h-10 rounded-full"
                  :src="
                    'https://www.dextools.io/resources/tokens/logos/ether/' +
                    item?.token?.address +
                    '.png'
                  "
                  alt="Image Description"
                  placeholder="TT"
                  @error="$event.target.class = 'hidden'"
                />

                <span
                  class="absolute bottom-1 end-1 block p-1 rounded-full transform translate-y-1/3 translate-x-1/3 border-1 w-5 h-5"
                >
                  <img :src="'/images/chains/' + currentChain + '.png'" alt="placeholder" />
                </span>
              </div>
              <div class="flex flex-col">
                <div class="text-zinc-100 font-bold text-sm">
                  {{ item?.pair }}
                </div>
                <div class="text-zinc-400 text-xs" v-html="item?.price.toFixed(8)"></div>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <div class="text-zinc-500 text-sm">
                <span :class="['text-red-500 font-bold text-sm']">
                  {{ item?.variation24h.toFixed(2) }}%</span
                >
              </div>
            </div>
          </Card>
        </router-link>
        <Card class="bg-neutral-700 py-2 px-4" @click="isLosersOpen = !isLosersOpen">
          <div
            class="flex gap-2 items-center font-medium text-sm text-center justify-center cursor-pointer m-auto"
          >
            {{ isLosersOpen ? 'Hide' : 'Show more' }}
          </div>
        </Card>
      </template>
    </div>
  </div>
</template>
