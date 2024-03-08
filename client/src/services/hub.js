import axios from 'axios'

const $hub = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? import.meta.env.VITE_DEV_HUB_API_RUL
      : import.meta.env.VITE_PRODUCTION_HUB_API_URL
})

const authInterceptor = (config) => {
  return config
}

$hub.interceptors.request.use(authInterceptor)

$hub.interceptors.response.use(
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

export { $hub }
