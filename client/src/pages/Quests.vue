<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { useQuests } from '@/composables/useQuests'
import { onMounted, ref } from 'vue'

const { getQuests } = useQuests()
const quests = ref([])

onMounted(async () => {
  const response = await getQuests()
  quests.value = response
})

</script>

<template>
  <div class="flex flex-col gap-3">
    <Card v-for="(quest, i) in quests" :key="i" class="py-3 px-4 flex-col gap-5">
      <div class="w-full text-left text-white text-md font-bold mb-3">{{ quest.name }}</div>
      <div class="flex flex-col w-full">
        <ol class="w-full relative border-s border-gray-200 dark:border-gray-700">
          <li class="mb-10 ms-4" v-for="level in Object.values(quest.questLevels.levels)" :key="level">
            <div class="absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 bg-green-500"></div>
            <small class="mb-1 text-sm text-white font-normal leading-none">
              {{ level.rangeSubtitle }}
            </small>
            <div class="text-lg font-semibold text-green-500">
              {{ level.level }}
            </div>
            <div class="mb-4 text-zinc-400 font-normal">
              {{ level.description }}
            </div>
          </li>
        </ol>
      </div>
      <Button text="Soon" type="primary" class="!w-full" />
    </Card>
  </div>
</template>
