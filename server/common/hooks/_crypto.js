import axios from 'axios'
import fetch from 'node-fetch'
import { bybit } from 'ccxt'
import config from '../config.json' assert { type: 'json' }

const exchange = new bybit()

const getEthHistoricalPrice = async (timestamp) => {
  return await new Promise(async (resolve, reject) => {
    const d = new Date((timestamp - 10860) * 1000)
    // date as 2023-12-01 14:48:58
    const formattedDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    const start = exchange.parse8601(formattedDate)
    exchange
      .fetchOHLCV('ETH/USDT', '1m', start, 5)
      .then((ohlcv) => resolve(ohlcv[0][3]))
      .catch((err) => {
        console.log(err)
        reject(0)
      })
  })
}

const getShitcoinPrice = async (ca) => {
  try {
    let res = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${ca}/price?chain=eth`, {
      headers: {
        'content-type': 'application/json',
        'X-API-Key': config.MORALIS_API_KEY
      }
    })
    res = await res.json()
    return {
      success: true,
      price: res.usdPrice,
      name: res.tokenName,
      symbol: res.tokenSymbol,
      decimal: +res.tokenDecimals,
      msg: res.message
    }
  } catch (err) {
    return {
      success: false,
      msg: err
    }
  }
}

const getShitcoinHistoricalPrice = async (ca, toBlock) => {
  try {
    let res = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/${ca}/price?chain=eth&to_block=${toBlock}`,
      {
        headers: {
          'content-type': 'application/json',
          'X-API-Key': config.MORALIS_API_KEY
        }
      }
    )
    res = await res.json()
    return {
      success: true,
      price: res.usdPrice,
      name: res.tokenName,
      symbol: res.tokenSymbol,
      decimal: +res.tokenDecimals,
      msg: res.message
    }
  } catch (err) {
    return {
      success: false,
      msg: err
    }
  }
}

export { getEthHistoricalPrice, getShitcoinPrice, getShitcoinHistoricalPrice }
