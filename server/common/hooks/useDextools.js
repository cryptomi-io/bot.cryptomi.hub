import { $dt } from '../services/dextools.js'
import fetch from 'node-fetch'
import { writeFile, mkdir, access } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { constants } from 'fs'

export const useDextools = () => {
  /**
   "data": {
    "address": "0xfb7b4564402e5500db5bb6d63ae671302777c75a",
    "name": "DEXTools",
    "symbol": "DEXT",
    "creationTime": "2021-07-03T14:14:39.000Z",
    "creationBlock": 12755070,
    "decimals": 18,
    "socialInfo": {
      "discord": "https://discord.com/",
      "medium": "https://medium.com/@DEXTools",
      "telegram": "https://t.me/DEXToolsCommunity",
      "tiktok": "https://www.tiktok.com/@dextools",
      "twitter": "https://twitter.com/DEXToolsApp",
      "website": "https://info.dextools.io/",
      "youtube": "https://www.youtube.com/c/DEXToolsAcademy?sub_confirmation=1",
      "instagram": "https://www.instagram.com/p/ClENweSMuGY/?igshid=YmMyMTA2M2Y=",
      "bitbucket": "",
      "facebook": "",
      "github": "",
      "linkedin": "",
      "reddit": ""
    }
   */
  const getTokenInfoByAddress = async (chain, address) => {
    //https://public-api.dextools.io/trial/v2/token/ether/0xfb7b4564402e5500db5bb6d63ae671302777c75a
    try {
      const response = await $dt.get('token/' + chain + '/' + address)
      if (response?.status === 200) {
        return response?.data?.data
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }

  /**
     * Retrieve audit information of a specific token.
     * GET /v2/token/{chain}/{address}/audit
     * 
      isOpenSource * string contract is open source
      isHoneypot * string Is a honeypot
      isMintable * string Token is mintable
      isProxy * string Token is behind a proxy
      slippageModifiable * string Slippage is modifiable
      isBlacklisted * string Token has blacklist support
      + sellTax* object Sell tax
       * min number Min tax
         max number Max tax
         status * string Tax status
      + buyTax* object Buy tax
       * min number Min tax
         max number Max tax
         status * string Tax status
      isContractRenounced * string Token contract is renounced for further modification
      isPotentiallyScam * string Token is potentially a scam
      updatedAt * date-time Audit update date
     */
  const getTokenAuditByAddress = async (chain, address) => {
    try {
      const response = await $dt.get('token/' + chain + '/' + address + '/audit')
      if (response?.status === 200) {
        return response?.data?.data
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }
  /**
     * Obtain additional information about a specific token.
     * GET /v2/token/{chain}/{address}/info
     * 
      circulatingSupply * number Token circulating supply
      totalSupply * number Token total supply
      mcap * number Token market cap
      fdv * number Token fully diluted volume
      holders * number Token holder count
      transactions * number Token transaction count
     */
  const getTokenAdditInfoByAddress = async (chain, address) => {
    try {
      const response = await $dt.get('token/' + chain + '/' + address + '/info')
      if (response?.status === 200) {
        return response?.data?.data
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }

  /**
     * Get lock information of a specific token.
     * GET /v2/token/{chain}/{address}/locks
     * 
      amountLocked * number Total token lock amount
      - nextUnlock object Next token unlock
        provider string Lock provider
        amount number Token amount locked
        lockDate date-time Lock date
        unlockDate * date-time Unlock date
      - locks array of object Token locks list
        provider string Lock provider
        amount number Token amount locked
        lockDate date-time Lock date
        unlockDate * date-time Unlock date
     */
  const getTokenLockInfoByAddress = async (chain, address) => {
    try {
      const response = await $dt.get('token/' + chain + '/' + address + '/locks')
      if (response?.status === 200) {
        return response?.data?.data
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }

  /**
     * Retrieve price information of a specific token.
     * GET /v2/token/{chain}/{address}/price 
     {
      "price": 0,
      "priceChain": 0,
      "price5m": 0,
      "priceChain5m": 0,
      "variation5m": 0,
      "price1h": 0,
      "priceChain1h": 0,
      "variation1h": 0,
      "price6h": 0,
      "priceChain6h": 0,
      "variation6h": 0,
      "price24h": 0,
      "priceChain24h": 0,
      "variation24h": 0
      }
     */
  const getTokenPriceByAddress = async (chain, address) => {
    try {
      const response = await $dt.get('token/' + chain + '/' + address + '/price')
      if (response?.status === 200) {
        return response?.data?.data
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }
  const getChains = async () => {
    // "https://public-api.dextools.io/trial/v2/blockchain" \
    const response = await $dt.get('blockchain', {
      params: {
        sort: 'name',
        order: 'asc'
      }
    })

    if (response?.status === 200) {
      return response?.data?.data?.results
    } else {
      return []
    }
  }
  const getGainers = async (chain) => {
    //https://public-api.dextools.io/trial/v2/ranking/ether/gainers
    const response = await $dt.get('ranking/' + chain + '/gainers')

    if (response?.status === 200) {
      return response?.data?.data
    } else {
      return []
    }
  }
  const getLosers = async (chain) => {
    //https://public-api.dextools.io/trial/v2/ranking/ether/losers
    const response = await $dt.get('ranking/' + chain + '/losers')

    if (response?.status === 200) {
      return response?.data?.data
    } else {
      return []
    }
  }
  const getImageToken = async (url, chain) => {
    const filename = url.split('/').pop()
    const baseDir = dirname(fileURLToPath(import.meta.url))
    const dir = join(baseDir, `../../../client/assets/images/crypto/${chain}`)
    const path = join(dir, filename)

    try {
      // Проверка на существование файла
      await access(path, constants.F_OK)
      //console.log(`File ${filename} already exists. No need to download.`);
      // Возвращаем относительный путь к существующему изображению
      return `/assets/images/crypto/${chain}/${filename}`
    } catch {
      // Файл не существует, продолжаем скачивание
      try {
        const response = await fetch(url)
        if (response.ok) {
          const buffer = await response.buffer()
          await mkdir(dir, { recursive: true }) // Убедитесь, что директория существует
          await writeFile(path, buffer)
          //console.log(`Image saved to ${path}`);
          return `/assets/images/crypto/${chain}/${filename}`
        } else {
          //console.log(`Image not found or error occurred: ${response.statusText}`);
          return null
        }
      } catch (error) {
        // console.error(`Failed to download image: ${error}`);
        return null
      }
    }
  }

  return {
    getChains,
    getGainers,
    getLosers,
    getTokenPriceByAddress,
    getTokenLockInfoByAddress,
    getTokenAdditInfoByAddress,
    getTokenAuditByAddress,
    getTokenInfoByAddress,
    getImageToken
  }
}
