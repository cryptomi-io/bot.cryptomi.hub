import axios from 'axios'
const API_KEY = import.meta.env.VITE_GECKO_API_KEY;

const $gecko = axios.create({
  baseURL: `https://pro-api.coingecko.com/api/v3/`,
  headers: {'x-cg-pro-api-key': API_KEY}
})

$gecko.interceptors.response.use(
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
    console.log('Retry the request $gecko')
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    return $gecko(error.config); // Retry the request
  }
)

export { $gecko }