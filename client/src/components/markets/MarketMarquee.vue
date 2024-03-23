<script setup>
import { useDexChains } from '@/store/dextools/chains'
import { computed, onMounted } from 'vue'

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})
const tokens = computed(() => DexChains.top || [])
const DexChains = useDexChains()
onMounted(() => {
  DexChains.getTop()
})
</script>
<template>
  <div v-if="tokens.length" :class="`${props.class}`">
    <Vue3Marquee class="bg-neutral-800" :duration="150">
      <router-link
        v-for="(item, i) in tokens"
        :key="i"
        :to="`/dex/${item?.chain}/${item?.token?.address}`"
        class="flex gap-1 items-center py-2 px-3"
      >
        <span class="w-8 text-center text-zinc-400">#{{ i + 1 }}</span>
        <div class="relative inline-block">
          <img
            class="inline-block w-6 h-6 rounded-full border-2"
            :src="`${item?.image}`"
            v-if="item?.image"
          />
          <div
            v-else
            class="inline-flex items-center justify-center w-6 h-6 text-xs text-white bg-indigo-500 rounded-full"
          >
            {{ item?.pair.substr(0, 1) }}
          </div>
          <span
            class="absolute bottom-1 end-0 block p-1 rounded-full transform translate-y-1/3 translate-x-1/3 border-1 w-5 h-5"
          >
            <img :src="'/images/chains/' + item?.chain + '.png'" alt="placeholder" />
          </span>
        </div>
        <span class="text-zinc-100 font-bold text-sm">{{ item?.pair }}</span>
      </router-link>
    </Vue3Marquee>
  </div>
</template>
