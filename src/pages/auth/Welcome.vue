<script setup>
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import Slider from '@/components/ui/Slider.vue'
import useAuth from '@/composables/useAuth'
import { useUserStore } from '@/store/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const { login } = useAuth()
const images = ['/images/slider/slide-1.jpg', '/images/slider/slide-2.png']
const router = useRouter()
const isLoading = ref(true)

onMounted(() => {
  //Сразу же пытаемся авторизоваться
  setTimeout(async() => {
    //пока здесь не подтягивается идентификатор из телеграм
    const userChatId = 123123123
    const isLogin = await login(userChatId)
    if (isLogin ) {
      userStore.setIsLoggedIn()
      router.push({ name: 'home' })
      isLoading.value = false
    }
    isLoading.value = false
  }, 1500)
})

const signIn = async () => {
  isLoading.value = true
  const userChatId = 123123123
  const isLogin = await login(userChatId)
  aler(isLogin)
  if (isLogin ) {
    userStore.setIsLoggedIn()
    router.push({ name: 'home' })
    isLoading.value = false
  } else {
    userStore.setIsLoggedIn(false)
    isLoading.value = false
    alert('Не удалось авторизоваться')
  }
}
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="flex relative flex-col justify-end h-screen py-10">
    <Slider class="h-screen w-full fixed z-10 top-0 left-0" :images="images" />
    <div class="flex flex-col relative z-50 gap-5">
      <div class="flex flex-col gap-3">
        <Button text="Login by Telegram" type="primary" :clickHandler="signIn" />
        <Button
          text="Sign Up"
          type="secondary"
          :clickHandler="() => router.push({ name: 'register' })"
        />
      </div>
      <p class="text-center mt-3 text-xs">
        By continuing, I agree to the
        <span class="text-violet-800 font-bold">Terms of Service</span> and
        <span class="text-violet-800 font-bold">Privacy Policy</span>
      </p>
    </div>
  </div>
</template>
