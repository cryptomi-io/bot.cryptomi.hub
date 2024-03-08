import axios from 'axios';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config()

const API_KEY = process.env.ETHERSCAN_API_KEY;

const $etherscan = axios.create({
  baseURL: `https://api.etherscan.io/api`,
})

$etherscan.interceptors.response.use(
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

export { $etherscan }