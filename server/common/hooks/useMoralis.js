import { $moralis } from '../services/moralis.js'
export const useMoralis = () => {
  /**
   * Retrieves the historical price of a given shitcoin token at a specified block.
   *
   * @param {string} contractAddress - The address of the token contract
   * @param {number} toBlock - The block number to retrieve the historical price for
   * @return {number} The historical price of the token in USD
   */
  const getShitcoinHistoricalPrice = async (contractAddress, toBlock) => {
    const params = new URLSearchParams({
      chain: 'eth',
      to_block: toBlock
    })

    const response = await $moralis.get(`erc20/${contractAddress}/price?${params}`)

    if (response.status !== 200) {
      ;`[historical price] moralis error on ${contractAddress}; block: ${toBlock}, response: \n${JSON.stringify(response)}`
      return null
    }
    return parseFloat(response.data.usdPriceFormatted)
  }

  const getShitcoinHistoricalMultiplePrices = async (tokens) => {
    const params = new URLSearchParams({
      chain: 'eth'
    })

    const response = await $moralis.post(`erc20/prices?${params}`, {
      tokens: tokens
    })
    if (response?.status !== 200) {
      console.error(
        `[historical price] moralis error on tokens; response: \n${JSON.stringify(response)}`
      )
      return null
    }
    return response.data
  }

  /**
   * Retrieves the price of a specific ERC20 token.
   *
   * @param {string} contractAddress - The address of the ERC20 token contract
   * @return {number} The price of the ERC20 token in USD
   */
  const getShitcoinPrice = async (contractAddress) => {
    const params = new URLSearchParams({
      chain: 'eth'
    })

    const response = await $moralis.get(`erc20/${contractAddress}/price?${params}`)

    if (response.status !== 200) {
      console.error(`moralis error on ${contractAddress}, response: \n${JSON.stringify(response)}`)
      return null
    }
    return parseFloat(response.data.usdPriceFormatted)
  }
  return {
    getShitcoinHistoricalPrice,
    getShitcoinHistoricalMultiplePrices,
    getShitcoinPrice
  }
}
