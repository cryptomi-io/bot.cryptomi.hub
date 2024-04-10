import axios from 'axios'
import dotenv from 'dotenv'
import process from 'process'
dotenv.config()

const NODE_ENV = process.env.NODE_ENV
const DEV_API_URL = process.env.DEV_API_URL
const PRODUCTION_API_URL = process.env.PRODUCTION_API_URL

const $cryptomi = axios.create({
  withCredentials: true,
  baseURL: NODE_ENV === 'development' ? DEV_API_URL : PRODUCTION_API_URL
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
