import axios from 'axios'
import dotenv from 'dotenv'
import process from 'process'
dotenv.config()

const API_KEY = process.env.MORALIS_API_KEY

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
  }
)

export { $moralis }
