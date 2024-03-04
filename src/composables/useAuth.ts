// Импортируем fetch API напрямую, используем глобальный fetch в Nuxt 3
import { $api } from '@/http';
import { useWebAppPopup } from 'vue-tg';

export default function useAuth() {
  const { showAlert } = useWebAppPopup()

  return {
    register,
    login
  }

  async function register(nickname:string, email:string, password:string, telegram_chat_id:string) {
    
    const response = await $api.post(`auth/register`, {
        nickname,
        email,
        password,
        telegram_chat_id: String(telegram_chat_id)
      })
      
      if (!response?.status !== 200 && response?.data?.error && response?.data?.error.status !==200) {
        showAlert('Произошла ошибка при регистрации')
        throw new Error('Произошла ошибка при регистрации');
      }
    
    return response?.data;
  }

  async function login(chatId:string) {
    
    const response = await $api.post(`auth/login/telegram`, {
        chatId: String(chatId) 
      })
      
    if (response?.status !== 200) {
      showAlert('Произошла ошибка при входе')
      throw new Error('Произошла ошибка при входе');
    }
    
    const data = response.data;

    return data?.status !== 'fail';
  }
}
