// Импортируем fetch API напрямую, используем глобальный fetch в Nuxt 3
import { useWebAppPopup } from 'vue-tg'
import { $cryptomi } from '../services/http'

export default function useAuth() {
  const { showAlert } = useWebAppPopup()

  return {
    register,
    login
  }

  async function register(nickname, telegram_chat_id, ref='') {
    const response = await $cryptomi.post(`auth/register/telegram`, {
      nickname,
      telegram_chat_id: String(telegram_chat_id),
      ref
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
    const response = await $cryptomi.post(`auth/login/telegram`, {
      chatId: String(chatId)
    })

    if (response?.status !== 200) {
      throw new Error('Произошла ошибка при входе')
    }

    const data = response.data

    return data?.status !== 'fail'
  }
}
