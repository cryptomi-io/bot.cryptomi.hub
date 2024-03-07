import { useEtherscan } from './useEtherscan'
import { useMoralis } from './useMoralis'

export const useAnalytics = () => {
  //only for developing
  const mode = 'prod'

  const { getShitcoinHistoricalMultiplePrices } = useMoralis()

  const {
    //start test data
    _temp_transactions,
    _temp_historycal_price,
    _temp_actual_prices,
    //end test data
    weiToNumber,
    getTransactions
  } = useEtherscan()

  const getPnLAnalyticsByEtherscan = async (wallet, days = 90) => {
    console.time('Execution Time')

    const transactions = mode === 'dev' ? _temp_transactions() : await getTransactions(wallet, days)

    const transactionsTokens = []

    //temp arrays
    const _tokenDataForGetPrices = []
    const _tokenPricesData = {}

    if (!transactions.length) {
      return {
        transactionsTokens: [],
        topTokens: [],
        loseTokens: [],
        tokensWithBalance: []
      }
    }
    //Generate array for get multiple plrices
    transactions.forEach((transaction) => {
      const { contractAddress, blockNumber } = transaction
      const existingToken = _tokenDataForGetPrices.find(
        (token) => token.to_block === blockNumber && token.token_address === contractAddress
      )
      if (!existingToken) {
        _tokenDataForGetPrices.push({
          token_address: contractAddress,
          to_block: blockNumber
        })
      }
    })

    const tokenHistoricalPrices =
      mode === 'dev'
        ? _temp_historycal_price()
        : await getShitcoinHistoricalMultiplePrices(_tokenDataForGetPrices)

    //Generate prices array by token and block
    tokenHistoricalPrices.forEach((token) => {
      if (!_tokenPricesData[token.tokenAddress]) {
        _tokenPricesData[token.tokenAddress] = {}
      }
      _tokenPricesData[token.tokenAddress][token.toBlock] = {
        usdPrice: token.usdPrice,
        usdPriceFormatted: token.usdPriceFormatted
      }
    })
    console.log('----------Token historical prices---------')
    console.log(tokenHistoricalPrices)

    transactions.forEach((transaction) => {
      const { contractAddress, tokenDecimal, tokenName, tokenSymbol } = transaction
      const side =
        transaction.from.toLocaleLowerCase() === wallet.toLocaleLowerCase() ? 'SELL' : 'BUY'

      transaction.side = side
      transaction.tokenUSDPrice =
        _tokenPricesData[contractAddress][transaction.blockNumber].usdPrice

      let token = transactionsTokens[contractAddress]

      if (!token) {
        token = {
          tokenDecimal,
          contractAddress,
          name: tokenName,
          symbol: tokenSymbol,
          transactions: [
            {
              blockNumber: transaction.blockNumber,
              contractAddress: transaction.contractAddress,
              cumulativeGasUsed: transaction.cumulativeGasUsed,
              from: transaction.from,
              gas: transaction.gas,
              gasPrice: transaction.gasPrice,
              gasUsed: transaction.gasUsed,
              side: transaction.side,
              timeStamp: transaction.timeStamp,
              to: transaction.to,
              tokenName: transaction.tokenName,
              tokenSymbol: transaction.tokenSymbol,
              tokenUSDPrice: transaction.tokenUSDPrice,
              value: transaction.value
            }
          ]
        }
        transactionsTokens[contractAddress] = token
      } else {
        token.transactions.push({
          blockNumber: transaction.blockNumber,
          contractAddress: transaction.contractAddress,
          cumulativeGasUsed: transaction.cumulativeGasUsed,
          from: transaction.from,
          gas: transaction.gas,
          gasPrice: transaction.gasPrice,
          gasUsed: transaction.gasUsed,
          side: transaction.side,
          timeStamp: transaction.timeStamp,
          to: transaction.to,
          tokenName: transaction.tokenName,
          tokenSymbol: transaction.tokenSymbol,
          tokenUSDPrice: transaction.tokenUSDPrice,
          value: transaction.value
        })
      }
    })

    console.log('----------Token transactions---------')
    console.log(transactionsTokens)
    Object.values(transactionsTokens).forEach((token) => {
      let profitNotItPnL = 0
      let tokenBalance = 0
      let totalBuy = 0
      let totalSell = 0
      let latestTransactionType = null
      let PnL = 0
      let PnLPercent = 0
      token.transactions
        .sort((a, b) => a.timeStamp - b.timeStamp)
        .forEach((transaction) => {
          if (latestTransactionType === 'SELL') {
            if (transaction.side === 'SELL') {
              //Если пользователь в очередной раз продает токен то проверяем какой объем он продает
              //если продал больше чем купил ранее
              if (weiToNumber(transaction.value) > tokenBalance) {
                //Получаем кол-во токенов которые не используются при рассчете PnL
                const notProfitValue = weiToNumber(transaction.value) - tokenBalance
                //Увеличиваем профит который не учитывается при рассчете PnL
                profitNotItPnL +=
                  notProfitValue * transaction.tokenUSDPrice -
                  weiToNumber(transaction.gasPrice * transaction.gasUsed)
                //Обновляем сколько было продано токена
                totalSell +=
                  tokenBalance * transaction.tokenUSDPrice -
                  weiToNumber(transaction.gasPrice * transaction.gasUsed)
                //Обнуляем баланс предполагая что было продано все
                tokenBalance = 0
                //если продал меньше или столько же чем купил ранее
              } else if (transaction.value <= tokenBalance) {
                //Обновляем сумму на которую было продано
                totalSell +=
                  weiToNumber(transaction.value) * transaction.tokenUSDPrice -
                  weiToNumber(transaction.gasPrice * transaction.gasUsed)
                //Обновляем остаточный баланс
                tokenBalance -= weiToNumber(transaction.value)
              }
            } else if (transaction.side === 'BUY') {
              //Если пользователь ранее продавал а теперь вновь купил то обновляем общую сумму покупки
              totalBuy +=
                weiToNumber(transaction.value) * transaction.tokenUSDPrice +
                weiToNumber(transaction.gasPrice * transaction.gasUsed)
              //Обновляем баланс купленного
              tokenBalance += weiToNumber(transaction.value)
            }
          } else if (latestTransactionType === 'BUY') {
            if (transaction.side === 'SELL') {
              //если продал больше чем купил ранее
              if (weiToNumber(transaction.value) > tokenBalance) {
                //Получаем кол-во токенов которые не используются при рассчете PnL
                const notProfitValue = weiToNumber(transaction.value) - tokenBalance
                //Увеличиваем профит который не учитывается при рассчете PnL
                profitNotItPnL +=
                  notProfitValue * transaction.tokenUSDPrice -
                  weiToNumber(transaction.gasPrice * transaction.gasUsed)
                //Обновляем сколько было продано токена
                totalSell +=
                  tokenBalance * transaction.tokenUSDPrice -
                  weiToNumber(transaction.gasPrice * transaction.gasUsed)
                //Обнуляем баланс предполагая что было продано все
                tokenBalance = 0
                //если продал меньше или столько же чем купил ранее
              } else if (weiToNumber(transaction.value) <= tokenBalance) {
                //Обновляем сумму на которую было продано
                totalSell +=
                  weiToNumber(transaction.value) * transaction.tokenUSDPrice -
                  weiToNumber(transaction.gasPrice * transaction.gasUsed)
                //Обновляем остаточный баланс
                tokenBalance -= weiToNumber(transaction.value)
              }
            } else if (transaction.side === 'BUY') {
              //Если купил снова то обновляем общую сумму покупки токена
              totalBuy +=
                weiToNumber(transaction.value) * transaction.tokenUSDPrice +
                weiToNumber(transaction.gasPrice * transaction.gasUsed)
              //Обновляем информацию о кол-ве токенов
              tokenBalance += weiToNumber(transaction.value)
            }
          } else {
            //если нет информации о том покупал ли пользователь ранее или продавал
            latestTransactionType = transaction.side
            if (transaction.side === 'SELL') {
              //Если продал то мы записываем профит который не учитывается при рассчете PnL
              profitNotItPnL +=
                weiToNumber(transaction.value) * transaction.tokenUSDPrice -
                weiToNumber(transaction.gasPrice * transaction.gasUsed)
            } else if (transaction.side === 'BUY') {
              //Если купил то обновляем общую стоимость покупки и баланс токенов
              totalBuy +=
                weiToNumber(transaction.value) * transaction.tokenUSDPrice +
                weiToNumber(transaction.gasPrice * transaction.gasUsed)
              tokenBalance += weiToNumber(transaction.value)
            }
          }
        })
      //После огромного числа проверок и рассчетов мы имеет totalSell & totalBuy для того чтобы рассчитать PnL
      //Если пользователь продавал купленный токен в переданном интервале времени
      if (totalBuy !== 0 && totalSell !== 0) {
        PnL = totalSell - totalBuy
        //Считаем сколько в процентах
        PnLPercent = (PnL / totalBuy) * 100
      }

      //Обновляем информацию о токене
      token.totalBuy = totalBuy
      token.totalSell = totalSell
      token.tokenBalance = tokenBalance
      token.unrealizedPnL = 0
      token.unrealizedPnLPercent = 0
      token.PnL = PnL
      token.PnLPercent = PnLPercent
      token.profitNotItPnL = profitNotItPnL
    })

    const _caForPrices = []
    Object.values(transactionsTokens)
      .filter((token) => token.tokenBalance)
      .forEach((token) => {
        _caForPrices.push({
          token_address: token.contractAddress
        })
      })
    if (_caForPrices.length > 0) {
      const _tokenActualPrices =
        mode === 'dev'
          ? _temp_actual_prices()
          : await getShitcoinHistoricalMultiplePrices(_caForPrices)
      Object.values(transactionsTokens).forEach((token) => {
        token.unrealizedPnL =
          token.tokenBalance *
          Number(
            _tokenActualPrices.find((token) => token.token_address === token.contractAddress)
              .usdPriceFormatted
          )
        token.unrealizedPnLPercent = (token.unrealizedPnL / token.tokenBalance) * 100
      })
    }
    console.log(transactionsTokens)
    console.timeEnd('Execution Time')
    return Object.values(transactionsTokens).filter(
      (token) => token.PnL !== 0 || token.unrealizedPnL !== 0
    )
  }
  return {
    getPnLAnalyticsByEtherscan
  }
}
