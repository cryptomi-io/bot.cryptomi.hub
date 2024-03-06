import axios from 'axios'
const API_KEY = "yZIeOdvLWd7XQPUf1T7yc3QQZZfw2K0n20OOaTDS";

const $dt = axios.create({
  baseURL: `https://public-api.dextools.io/trial/v2/`,
  headers: {
    'accept':'application/json',
    'x-api-key': API_KEY
  }
})

$dt.interceptors.response.use(
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

export { $dt }