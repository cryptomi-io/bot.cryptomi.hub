import axios from 'axios'
const API_KEY = import.meta.env.VITE_MORALIS_API_KEY

const $moralis = axios.create({
  baseURL: `https://deep-index.moralis.io/api/v2/`,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  }
})

$moralis.interceptors.response.use(
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
    console.log('Retry the request $moralis')
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for 1 second
    return $moralis(error.config) // Retry the request
  }
)

export { $moralis }
