import axios from 'axios'


const $api = axios.create({
  withCredentials: true,
  baseURL: `https://cryptomi.io/api/`
})
const authInterceptor = (config) => {
  return config
}

$api.interceptors.request.use(authInterceptor)

$api.interceptors.response.use(
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

export { $api }
