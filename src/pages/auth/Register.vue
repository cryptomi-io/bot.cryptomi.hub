<script setup>
import Button from '@/components/ui/Button.vue';
import useAuth from '@/composables/useAuth';
import { useRouter } from 'vue-router';

import { ref } from 'vue';
import { useWebApp, useWebAppPopup } from 'vue-tg';



const { register } = useAuth();
const { initDataUnsafe } = useWebApp();
const { showAlert } = useWebAppPopup()
const router = useRouter()

const isLoading = ref(false)


let chatId = initDataUnsafe?.user?.id;

const formData = ref({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})
console.log(formData)
const formHandleSubmit = async () => {
  isLoading.value = true
  const {nickname, email, password, confirmPassword} = formData.value

  if(password !== confirmPassword){
    showAlert('Passwords doesn\'t match')
    return
  }
  if(password.length < 8){
    showAlert('Passwords should be more 8 symbols')
    return
  }
  const result = await register(nickname, email, password, chatId)
  if(result?.data){
    await setTimeout(async() => {
        isLoading.value = false
        router.push({ name: 'welcome' })
    }, 1500)
  }
}
</script>

<template>
  <Loader v-if="isLoading" />
  <div v-else class="flex flex-col justify-center h-screen gap-3">
    <Card class="px-3 py-4 flex flex-col gap-5">
      <div class="text-xl font-bold">Sign Up</div>
      <form class="flex flex-col gap-3" @submit.prevent="formHandleSubmit">
        <input
          v-model="formData.nickname"
          type="text"
          required
          placeholder="nickname"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
        />
        <input
          v-model="formData.email"
          type="email"
          required
          placeholder="email@email.com"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
        />
        <input
          v-model="formData.password"
          type="password"
          required
          placeholder="********"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
        />
        <input
          v-model="formData.confirmPassword"
          type="password"
          required
          placeholder="********"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm focus:outline-none"
        />
        <Button text="Sign Up" type="primary" class="!w-full"/>
      </form>
    </Card>
  </div>
</template>
