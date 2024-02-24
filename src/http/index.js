import axios from 'axios'

const $api = axios.create({
  withCredentials: true,
  baseURL: `https://dev.cryptomi.io/api/`
})
const authInterceptor = (config) => {
  if (localStorage.getItem('accessToken')) {
    config.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`
  }
  return config
}

$api.interceptors.request.use(authInterceptor)

$api.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        //Получаем новый токен
      } catch (e) {
        console.log('Ошибка авторизации')
        //Делаем логаут
      }
    }
    if (error.response?.status === 500) {
      console.log('Произошла непредвиденная ошибка, попробуйте позже')
    }
    if (error.response?.status === 420) {
      return error.response
    }
  }
)

export { $api }
