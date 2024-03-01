// Импортируем fetch API напрямую, используем глобальный fetch в Nuxt 3
import { $api } from '@/http';
export default function useAuth() {

  return {
    register,
    login
  }

  async function register(nickname, email, password) {
    
    const response = await $api.post(`auth/register`, {
        nickname,
        email,
        password
      })
      
      if (!response?.status !== 200 && response?.data?.error && response?.data?.error.status !==200) {
        throw new Error('Произошла ошибка при регистрации');
      }
    
    return response?.data;
  }

  async function login(chatId) {
    
    const response = await $api.post(`auth/login/telegram`, {
        chatId: String(chatId) 
      })
      
    if (response?.status !== 200) {
      throw new Error('Произошла ошибка при входе');
    }
    
    const data = response.data;

    return data?.status !== 'fail';
  }
}
