<script setup>
import { computed, onMounted, watch } from 'vue'
import { useTonWalletStore } from '@/store/wallets/ton-wallet'
import { useHelper } from '@/utils/helper'
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { useTon } from '@/composables/useTon'
import { useRouter } from 'vue-router'
import { BackButton } from 'vue-tg'
import dayjs from 'dayjs'

const router = useRouter()

const ton = useTon()
const TonWalletStore = useTonWalletStore()
// const userWallet = computed(() => TonWalletStore.wallet.address)
const userWallet = computed(() => 'UQCV3YdlxazBZpIeb-7426nun1B-yyMrAtUNdl5zubWYfRQv')
const { shortenContractAddress, numberFormat } = useHelper()
const address = ref('')
const account = ref(null)
const transactions = ref([])
const isLoading = ref(false)
const is_hideBalance = ref(localStorage.getItem('is_hideBalance') || false)
const is_hideTransactionList = ref(true)

onMounted(async () => {
  if (!userWallet.value) return
  isLoading.value = true
  address.value = ton.getUserFriendlyAddress(userWallet.value)
  account.value = await ton.getAccount(userWallet.value)
  transactions.value = await ton.getTransactions(userWallet.value, 30)
  await ton.getJettonTransfers(userWallet.value)
  isLoading.value = false
})

watch(userWallet.value, async (newVal) => {
  if (!newVal) return
  isLoading.value = true
  address.value = ton.getUserFriendlyAddress(newVal)
  account.value = await ton.getBalance(newVal)
  transactions.value = await ton.getTransactions(userWallet.value, 30)
  isLoading.value = false
})
const copy = (text) => {
  navigator.clipboard.writeText(text)
  toast('Copied to clipboard', {
    autoClose: 1000,
    type: 'success',
    position: 'top-right',
    theme: 'dark',
    toastStyle: 'top:10px'
  })
}
const hideBalance = (is_hide) => {
  localStorage.setItem('is_hideBalance', is_hide)
  is_hideBalance.value = is_hide
}
function handleBackButton() {
  router.push('/')
}
</script>

<template>
  <BackButton @click="handleBackButton" />

  <div class="flex flex-col gap-3">
    <template v-if="userWallet">
      <template v-if="isLoading">
        <Card class="gap-2 items-center flex-col text-zinc-100">
          <div class="flex flex-col items-center px-4 py-5">
            <span class="w-[120px] h-[16px] rounded-xl animate-pulse bg-neutral-700"></span>

            <div class="flex gap-3 items-center ml-8 mt-2">
              <span
                class="w-[145px] h-[30px] inline-flex rounded-xl animate-pulse bg-neutral-700"
              ></span>
              <span
                class="w-[20px] h-[20px] inline-flex rounded-full animate-pulse bg-neutral-700"
              ></span>
            </div>
            <!-- <div class="text-xs">= 0, 0000050 BTC</div> -->
            <span
              class="w-[100px] h-[16px] inline-flex rounded-full animate-pulse bg-neutral-700 mt-2"
            ></span>
          </div>
          <div class="flex border-t border-zinc-700 w-full">
            <div
              class="flex flex-col items-center justify-center border-r border-zinc-700 w-full gap-1 py-4"
            >
              <div
                class="text-green-500 border-2 rounded-lg border-green-500 w-[27px] h-[27px] flex justify-center"
              >
                <Icon
                  icon="radix-icons:arrow-bottom-right"
                  class="w-4 h-4 mt-1 relative -left-[1px]"
                />
              </div>
              <span
                class="w-[60px] h-[16px] inline-flex rounded-full animate-pulse bg-neutral-700"
              ></span>
            </div>
            <div
              class="flex flex-col items-center justify-center border-r border-zinc-700 w-full gap-1"
            >
              <div
                class="text-green-500 border-2 rounded-lg border-green-500 w-[27px] h-[27px] flex justify-center"
              >
                <Icon icon="radix-icons:arrow-top-right" class="w-4 h-4 mt-1" />
              </div>
              <span
                class="w-[60px] h-[16px] inline-flex rounded-full animate-pulse bg-neutral-700"
              ></span>
            </div>
            <div class="flex flex-col items-center justify-center w-full gap-1">
              <div
                class="text-green-500 rounded-lg border-2 border-green-500 w-[27px] h-[27px] flex justify-center"
              >
                <Icon icon="mdi:arrow-bottom" class="w-4 h-4 mt-1" />
              </div>
              <span
                class="w-[60px] h-[16px] inline-flex rounded-full animate-pulse bg-neutral-700"
              ></span>
            </div>
          </div>
        </Card>
        <div class="text-zinc-100 text-lg font-bold">My assets</div>
        <div class="flex flex-col gap-1">
          <Card v-for="i in 5" :key="i" class="flex justify-between text-zinc-100 px-4 py-3">
            <div class="flex gap-2 items-center">
              <span class="w-8 h-8 inline-flex rounded-full animate-pulse bg-neutral-700"></span>
              <div class="flex flex-col">
                <span
                  class="w-[44px] h-[24px] inline-flex rounded-md animate-pulse bg-neutral-700"
                ></span>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <span
                class="w-[80px] h-[20px] inline-flex rounded-md animate-pulse bg-neutral-700"
              ></span>
            </div>
          </Card>
        </div>
        <div class="text-zinc-100 text-lg font-bold">Last Transactions</div>
        <Card class="py-3 px-4 gap-2 !items-start flex-col text-zinc-100">
          <div class="flex flex-col gap-5 w-full">
            <div class="flex justify-between gap-2" v-for="i in 5" :key="i">
              <div class="flex gap-2">
                <span class="w-[27px] h-[27px] rounded-md animate-pulse bg-neutral-700"></span>
                <div class="flex flex-col gap-1">
                  <span class="w-[85px] h-[16px] rounded-md animate-pulse bg-neutral-700"></span>
                  <div class="flex gap-1">
                    <span class="w-[100px] h-[11px] rounded-md animate-pulse bg-neutral-700"></span>
                    <span class="w-3 h-3 rounded-md animate-pulse bg-neutral-700"></span>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-1 items-end">
                <span class="w-[60px] h-[16px] rounded-md animate-pulse bg-neutral-700"></span>
                <span class="w-[90px] h-[11px] rounded-md animate-pulse bg-neutral-700"></span>
              </div>
            </div>
          </div>
        </Card>
      </template>
      <template v-else>
        <Card class="gap-2 items-center flex-col text-zinc-100">
          <div class="flex flex-col items-center px-4 py-5">
            <div class="text-xs text-zinc-500">Wallet balance (TON)</div>
            <div class="flex gap-3">
              <div class="text-2xl ml-8">
                <span v-if="is_hideBalance">******</span>
                <span v-else>{{ Number(account?.balance)?.toFixed(4) }}</span> TON
              </div>
              <Icon
                :icon="is_hideBalance ? 'majesticons:eye-off-line' : 'majesticons:eye-line'"
                class="w-5 h-5 mt-2"
                @click="hideBalance(!is_hideBalance)"
              />
            </div>
            <!-- <div class="text-xs">= 0, 0000050 BTC</div> -->
            <div class="text-xs flex gap-2 items-center" @click="copy(address)">
              {{ shortenContractAddress(address) }}
              <Icon icon="ion:copy" class="w-3 h-3 text-zinc-100" />
            </div>
          </div>
          <div class="flex border-t border-zinc-700 w-full">
            <div
              class="flex flex-col items-center justify-center border-r border-zinc-700 w-full gap-1 py-4"
            >
              <div
                class="text-green-500 border-2 rounded-lg border-green-500 w-[27px] h-[27px] flex justify-center"
              >
                <Icon
                  icon="radix-icons:arrow-bottom-right"
                  class="w-4 h-4 mt-1 relative -left-[1px]"
                />
              </div>
              <div class="text-xs">Send(soon)</div>
            </div>
            <div
              class="flex flex-col items-center justify-center border-r border-zinc-700 w-full gap-1"
            >
              <div
                class="text-green-500 border-2 rounded-lg border-green-500 w-[27px] h-[27px] flex justify-center"
              >
                <Icon icon="radix-icons:arrow-top-right" class="w-4 h-4 mt-1" />
              </div>
              <div class="text-xs">Recive(soon)</div>
            </div>
            <div class="flex flex-col items-center justify-center w-full gap-1">
              <div
                class="text-green-500 rounded-lg border-2 border-green-500 w-[27px] h-[27px] flex justify-center"
              >
                <Icon icon="mdi:arrow-bottom" class="w-4 h-4 mt-1" />
              </div>
              <div class="text-xs">Swap(soon)</div>
            </div>
          </div>
        </Card>
        <div class="text-zinc-100 text-lg font-bold">My assets</div>
        <div class="flex flex-col gap-1">
          <Card
            v-for="(item, i) in account?.wallets"
            :key="i"
            class="flex justify-between text-zinc-100 px-4 py-3"
          >
            <div class="flex gap-2 items-center">
              <img :src="item.image" class="w-8 h-8 rounded-full" />
              <div class="flex flex-col">
                <div class="text-md font-bold">{{ item.currency }}</div>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <template v-if="item.address">
                <div
                  v-if="!is_hideBalance"
                  class="text-sm"
                  v-html="
                    `${numberFormat(Number(item.available_balance), 3, true)} ${item.currency}`
                  "
                ></div>
                <div v-else class="text-sm">*****</div>
              </template>
              <template v-else>
                <div
                  class="rounded-3xl px-2 py-1 inline-flex cursor-pointer justify-center focus:outline-none opacity-30 text-zinc-100 border border-zinc-100 text-xs"
                >
                  Add wallet
                </div>
              </template>
            </div>
          </Card>
        </div>
        <div class="text-zinc-100 text-lg font-bold">Last Transactions</div>
        <template v-if="!transactions?.length">
          <Card class="py-3 px-4 gap-2 !items-start flex-col text-zinc-100">
            <div class="py-5 flex justify-center w-full text-md">Not found</div>
          </Card>
        </template>
        <template v-else>
          <Card class="py-3 px-4 gap-2 !items-start flex-col text-zinc-100">
            <div class="flex flex-col gap-5 w-full">
              <div
                class="flex justify-between gap-2"
                v-for="(item, i) in is_hideTransactionList
                  ? transactions.slice(0, 5)
                  : transactions"
                :key="i"
              >
                <div class="flex gap-2" v-if="item.success">
                  <div
                    class="border-2 shrink-0 rounded-lg w-[27px] h-[27px] flex justify-center"
                    :class="
                      item.side === 'DEPOSIT'
                        ? 'border-green-500 text-green-500'
                        : 'border-red-500 text-red-500'
                    "
                  >
                    <Icon
                      :icon="
                        item.side === 'DEPOSIT'
                          ? 'radix-icons:arrow-top-right'
                          : 'radix-icons:arrow-bottom-right'
                      "
                      class="w-4 h-4 mt-1 relative -left-[1px]"
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <div class="text-xs text-zinc-100 font-medium">
                      {{ item.side === 'DEPOSIT' ? 'Deposit' : 'Withdrawal' }}
                    </div>
                    <div class="text-xs text-zinc-400 flex gap-1 items-center">
                      <span>
                        To:
                        {{
                          shortenContractAddress(
                            ton.getUserFriendlyAddress(
                              item.side === 'DEPOSIT' ? item.from_address : item.to_address
                            ),
                            6
                          )
                        }}
                      </span>
                      <div
                        @click="
                          copy(
                            ton.getUserFriendlyAddress(
                              item.side === 'DEPOSIT' ? item.from_address : item.to_address
                            )
                          )
                        "
                      >
                        <Icon icon="ion:copy" class="w-3 h-3 text-zinc-100" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-1 items-end">
                  <div
                    class="text-xs font-medium"
                    :class="item.side === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'"
                  >
                    {{ item.side === 'DEPOSIT' ? '+' : '-'
                    }}{{ Number(item.amount).toFixed(5) }} TON
                  </div>
                  <div class="text-xs text-zinc-400 font-light">
                    {{ dayjs(item?.created_at).format('DD-MM-YYYY HH:mm') }}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card
            class="bg-neutral-700 py-2 px-4"
            @click="is_hideTransactionList = !is_hideTransactionList"
          >
            <div
              class="flex gap-2 items-center text-zinc-100 font-medium text-sm text-center justify-center cursor-pointer m-auto"
            >
              {{ is_hideTransactionList ? 'Show more' : 'Hide' }}
            </div>
          </Card>
        </template>
      </template>
    </template>
    <template v-else>
      <div class="text-zinc-400 flex flex-col items-center py-10 font-medium">
        Wallet is not connected
      </div>
    </template>
  </div>
</template>
