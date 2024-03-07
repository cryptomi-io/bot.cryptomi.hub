// Импортируем fetch API напрямую, используем глобальный fetch в Nuxt 3
import { $api } from '@/services/http'
import { useWebAppPopup } from 'vue-tg'

export default function useAuth() {
  const { showAlert } = useWebAppPopup()

  return {
    register,
    login
  }

  async function register(
    nickname,
    telegram_chat_id
  ) {
    const response = await $api.post(`auth/register/telegram`, {
      nickname,
      telegram_chat_id: String(telegram_chat_id)
    })

    if (
      !response?.status !== 200 &&
      response?.data?.error &&
      response?.data?.error.status !== 200
    ) {
      throw new Error('Произошла ошибка при регистрации')
    }

    return response?.data
  }

  async function login(chatId) {
    const response = await $api.post(`auth/login/telegram`, {
      chatId: String(chatId)
    })

    if (response?.status !== 200) {
      throw new Error('Произошла ошибка при входе')
    }

    const data = response.data

    return data?.status !== 'fail'
  }
}
