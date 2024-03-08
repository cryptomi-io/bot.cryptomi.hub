import axios from 'axios';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config()


const API_KEY = process.env.GECKO_API_KEY;

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
  }
)

export { $gecko };
