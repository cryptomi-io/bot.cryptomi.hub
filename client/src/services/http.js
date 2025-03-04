import axios from 'axios'

const $cryptomi = axios.create({
  withCredentials: true,
  baseURL:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_PRODUCTION_API_URL
})

const authInterceptor = (config) => {
  return config
}

$cryptomi.interceptors.request.use(authInterceptor)

$cryptomi.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    if (error.response?.status === 500) {
      console.log('Произошла непредвиденная ошибка, попробуйте позже')
    }
    if (error.response?.status === 420) {
      return error.response
    }
  }
)

export { $cryptomi }
