export const useMoralis = () => {
  const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY

  /**
   * Retrieves the historical price of a given shitcoin token at a specified block.
   *
   * @param {string} contractAddress - The address of the token contract
   * @param {number} toBlock - The block number to retrieve the historical price for
   * @return {number} The historical price of the token in USD
   */
  const getShitcoinHistoricalPrice = async (contractAddress, toBlock) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': MORALIS_API_KEY
    }
    const params = new URLSearchParams({
      chain: 'eth',
      to_block: toBlock
    })
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/${contractAddress}/price?${params}`,
      { headers }
    )
    const data = await response.json()

    if (data.message) {
      console.error(
        `[historical price] moralis error on ${contractAddress}; block: ${toBlock}, response: \n${JSON.stringify(data)}`
      )
      return null
    }

    return parseFloat(data.usdPriceFormatted)
  }

  const getShitcoinHistoricalMultiplePrices = async (tokens) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': MORALIS_API_KEY
    }
    const params = new URLSearchParams({
      chain: 'eth'
    })

    const response = await fetch(`https://deep-index.moralis.io/api/v2/erc20/prices?${params}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ tokens: tokens })
    })
    const data = await response.json()

    if (data.message) {
      console.error(
        `[historical price] moralis error on tokens; response: \n${JSON.stringify(data)}`
      )
      return null
    }
    return data
  }

  /**
   * Retrieves the price of a specific ERC20 token.
   *
   * @param {string} contractAddress - The address of the ERC20 token contract
   * @return {number} The price of the ERC20 token in USD
   */
  const getShitcoinPrice = async (contractAddress) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': MORALIS_API_KEY
    }
    const params = new URLSearchParams({
      chain: 'eth'
    })
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/${contractAddress}/price?${params}`,
      { headers }
    )
    const data = await response.json()

    if (data.message) {
      console.error(`moralis error on ${contractAddress}, response: \n${JSON.stringify(data)}`)
      return null
    }

    return parseFloat(data.usdPriceFormatted)
  }
  return {
    getShitcoinHistoricalPrice,
    getShitcoinHistoricalMultiplePrices,
    getShitcoinPrice
  }
}
