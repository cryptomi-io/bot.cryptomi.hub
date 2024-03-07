<script setup>
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import Slider from '@/components/ui/Slider.vue'
import useAuth from '@/composables/useAuth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const { login, register } = useAuth()

import { useUserStore } from '@/store/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWebApp } from 'vue-tg'

const userStore = useUserStore()
const images = ['/images/slider/slide.png']
const router = useRouter()
const isLoading = ref(true)

const { initDataUnsafe } = useWebApp()
//let chatId = initDataUnsafe?.user?.id;
console.log(initDataUnsafe?.user)

let chatId = 6754514128
onMounted(async () => {
  //Сразу же пытаемся авторизоваться
  await setTimeout(async () => {
    //пока здесь не подтягивается идентификатор из телеграм
    const isLogin = await login(chatId)
    if (isLogin) {
      userStore.setIsLoggedIn()
      router.push({ name: 'home' })
      isLoading.value = false
    }
    isLoading.value = false
  }, 1500)
})

const signIn = async () => {
  isLoading.value = true
  // const nickname = initDataUnsafe.user.nickname
  // const chatId = initDataUnsafe.user.id
  const nickname = 'telegram user'
  const chatId = 6754514128

  //Регистрируем пользователя
  try {
    await register(nickname, chatId)
    toast('You have successfully registered', {
      autoClose: 3000,
      type: 'success',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    }) // ToastOptions
    userStore.setIsLoggedIn()
    router.push({ name: 'home' })
    isLoading.value = false
  } catch (e) {
    toast('Something went wrong', {
      autoClose: 3000,
      type: 'error',
      position: 'top-right',
      theme: 'dark',
      toastStyle: 'top:10px'
    }) // ToastOptions
  }
}
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="flex relative flex-col justify-end h-screen py-10">
    <Slider class="h-screen w-full fixed z-10 top-0 left-0" :images="images" />
    <div class="flex flex-col relative z-50 gap-5">
      <div class="flex flex-col gap-3">
        <Button
          text="Login by Telegram"
          type="primary"
          :clickHandler="signIn"
          class="text-white font-bold"
        />
      </div>
      <p class="text-center mt-3 text-xs">
        By continuing, I agree to the
        <span class="text-green-800 font-bold">Terms of Service</span> and
        <span class="text-green-800 font-bold">Privacy Policy</span>
      </p>
    </div>
  </div>
</template>
