<script setup>
import { computed, ref } from 'vue';
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { useQuests } from '@/composables/useQuests';

const { getQuests } = useQuests()

let quests = ref([])

computed(async () => {
  quests = await getQuests()

  for (const quest of quests){
    console.log(quest.name)
    for (const level of Object.values(quest.questLevels[0].levels)) {
      console.log(level)
    }
    console.log("333333333333")
  }
})
// const quests = [
//   {
//     title: "Deposit Quest's",
//     conditions: [
//       {
//         title: 'Copper level',
//         subtitle: 'Deposit from 5 to 499 USDT',
//         description: 'Reward 5% of the deposit amount.'
//       },
//       {
//         title: 'Silver level',
//         subtitle: 'Deposit from 500 to 999 USDT',
//         description: 'Reward 7.5% of the deposit amount.'
//       },
//       {
//         title: 'Gold level',
//         subtitle: 'Deposit of 1000 USDT and above',
//         description: 'Reward 10% of the deposit amount.'
//       }
//     ]
//   },
//   {
//     title: "TRADE RANK Quest's",
//     conditions: [
//       {
//         title: 'Copper level',
//         subtitle: 'Trading volume from 500 to 9999 USDT',
//         description: 'Reward 2% of the trading volume in $CTMI tokens.'
//       },
//       {
//         title: 'Copper level',
//         subtitle: 'Trading volume from 10000 to 49999 USDT',
//         description: 'Reward 3% of the trading volume.'
//       },
//       {
//         title: 'Copper level',
//         subtitle: 'Trading volume 50000 and ABOVE USDT',
//         description: 'Reward 5% of the trading volume.'
//       }
//     ]
//   },
//   {
//     title: "Invite Your Friends Quest's",
//     conditions: [
//       {
//         title: '1-5 referrals',
//         subtitle: 'Reward 10 $CTMI for each active referral',
//         description: '(who made a deposit and/or trading operations).'
//       },
//       {
//         title: '6-10 referrals',
//         subtitle: 'Reward 15 $CTMI for each active referral.',
//         description: ''
//       },
//       {
//         title: 'More than 10 referrals',
//         subtitle: 'Reward 20 $CTMI for each active referral.',
//         description: ''
//       }
//     ]
//   }
// ]
</script>

<template>
  <div class="flex flex-col gap-3">
    <Card v-for="(quest, i) in quests" :key="i" class="py-3 px-4 flex-col gap-5">
      <div class="w-full text-left text-white text-md font-bold mb-3">{{ quest.name }}</div>
      <div class="flex flex-col w-full">
        <ol class="w-full relative border-s border-gray-200 dark:border-gray-700">
          <li class="mb-10 ms-4" v-for="level in Object.values(quest.questLevels[0].levels)">
            <div class="absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 bg-green-500"></div>
            <small class="mb-1 text-sm text-white font-normal leading-none">
              {{ level }}
            </small>
            <div class="text-lg font-semibold text-green-500">
              {{ level }}
            </div>
            <div class="mb-4 text-zinc-400 font-normal">
              {{ level }}
            </div>
          </li>
        </ol>
      </div>
      <Button text="Soon" type="primary" class="!w-full" />
    </Card>
  </div>
</template>
