<script setup>
import Button from '@/components/ui/Button.vue'
const formData = {
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const formHandleSubmit = () => {}
</script>

<template>
  <div class="flex flex-col justify-center h-screen gap-3">
    <Card class="px-3 py-4 flex flex-col gap-5">
      <div class="text-xl font-bold">Sign Up</div>
      <form class="flex flex-col gap-3" @submit.prevent="formHandleSubmit">
        <input
          v-model="formData.nickname"
          type="text"
          required
          placeholder="nickname"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm"
        />
        <input
          v-model="formData.email"
          type="email"
          required
          placeholder="email@email.com"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm"
        />
        <input
          v-model="formData.password"
          type="password"
          required
          placeholder="********"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm"
        />
        <input
          v-model="formData.confirmPassword"
          type="confirm password"
          required
          placeholder="********"
          class="rounded-xl w-full bg-zinc-900 text-zinc-400 p-3 text-sm"
        />
        <Button text="Sign Up" type="primary" class="!w-full" />
      </form>
    </Card>
  </div>
</template>
