import { $api } from '@/http/index.js'
export default function useAuth() {
  const apiPath = 'https://dev.cryptomi.io/api/'

  return {
    register,
    login
  }

  /**
   * @desc Register new user
   * @param user User to register
   * @returns {Promise<JSONResponse>}
   */
  async function register(nickname, email, password) {
    // Attempt register
    const response = await $api('auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser'
      },
      body: {
        nickname,
        email,
        password,
        ref
      }
    })

    return response
  }

  /**
   * @desc Register new user
   * @param user User to log in
   * @returns {Promise<JSONResponse>}
   */
  async function login(user) {
    const response = await $api('auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser'
      },
      body: user
    })

    return response
  }
}
