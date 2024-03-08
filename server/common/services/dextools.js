import axios from 'axios'
import dotenv from 'dotenv'
import process from 'process'
dotenv.config()

const API_KEY = process.env.DEXTOOLS_API_KEY

const $dt = axios.create({
  baseURL: `https://public-api.dextools.io/trial/v2/`,
  headers: {
    accept: 'application/json',
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
    console.log('Retry the request')
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for 1 second
    return $dt(error.config) // Retry the request
  }
)

export { $dt }
