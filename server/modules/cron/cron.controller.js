import { PrismaClient } from '@prisma/client'
import { AssetTransfersCategory } from 'alchemy-sdk'
import axios from 'axios'
import dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import process from 'process'
import { useDextools } from '../../common/hooks/useDextools.js'
import { useEtherscan } from '../../common/hooks/useEtherscan.js'
import { useMoralis } from '../../common/hooks/useMoralis.js'
const { getGainers, getLosers, getImageToken } = useDextools()
const { getShitcoinHistoricalMultiplePrices } = useMoralis()
const { weiToNumber, getTransactions } = useEtherscan()
dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN
const prisma = new PrismaClient()
const $bot = new TelegramBot(token)

export class CronController {
  static chains = [
    {
      id: 'ether',
      name: 'Ethereum'
    },
    {
      id: 'blast',
      name: 'Blast'
    },
    {
      id: 'bsc',
      name: 'BNB Chain'
    },
    {
      id: 'solana',
      name: 'Solana'
    }
  ]
  static async updateMarkets() {
    try {
      this.chains.forEach(async (chain) => {
        //Update gainer
        const responseGainers = await getGainers(chain.id)

        //Delete all gainers values
        await prisma.rank_tokens.deleteMany({
          where: {
            side: 'gainer',
            chain: chain.id
          }
        })

        responseGainers.forEach(async (item) => {
          const imageToken = await getImageToken(
            'https://www.dextools.io/resources/tokens/logos/' +
              chain.id +
              '/' +
              item.mainToken.address +
              '.png',
            chain.id
          )
          //console.log('https://www.dextools.io/resources/tokens/logos/'+chain.id+'/'+item.mainToken.address+'.png')
          const tokenData = {
            address: item.mainToken.address,
            name: item.mainToken.name,
            symbol: item.mainToken.symbol,
            exchange: item.exchange.name,
            factory: item.exchange.factory,
            image: imageToken
          }
          //console.log('++++++++'+imageToken)
          // Create or update tokens in database
          let token = await prisma.token.findFirst({
            where: {
              address: tokenData.address
            }
          })

          if (!token) {
            token = await prisma.token.create({
              data: {
                ...tokenData
              }
            })
          }
          if (token) {
            const gainerData = {
              token_id: token.id,
              pair: item.mainToken.symbol + '/' + item.sideToken.symbol,
              rank: item?.rank,
              chain: chain.id,
              exchange: item.exchange.name,
              side: 'gainer',
              price: item?.price,
              price24h: item?.price24h,
              variation24h: item?.variation24h,
              creationBlock: item?.creationBlock,
              image: imageToken
            }
            await prisma.rank_tokens.create({
              data: {
                ...gainerData
              }
            })
          }
        })

        await delay(2000)
        //Update losers
        const responseLosers = await getLosers(chain.id)

        //Delete losers values
        await prisma.rank_tokens.deleteMany({
          where: {
            side: 'loser',
            chain: chain.id
          }
        })

        responseLosers.forEach(async (item) => {
          const imageToken = await getImageToken(
            'https://www.dextools.io/resources/tokens/logos/' +
              chain.id +
              '/' +
              item.mainToken.address +
              '.png',
            chain.id
          )

          const tokenData = {
            address: item.mainToken.address,
            name: item.mainToken.name,
            symbol: item.mainToken.symbol,
            exchange: item.exchange.name,
            factory: item.exchange.factory,
            image: imageToken
          }
          let token = await prisma.token.findFirst({
            where: {
              address: item.mainToken.address
            }
          })

          // Create token
          if (!token) {
            token = await prisma.token.create({
              data: {
                ...tokenData
              }
            })
          }
          if (token) {
            const loserData = {
              token_id: token.id,
              pair: item.mainToken.symbol + '/' + item.sideToken.symbol,
              rank: item?.rank,
              chain: chain.id,
              exchange: item.exchange.name,
              side: 'loser',
              price: item?.price,
              price24h: item?.price24h,
              variation24h: item?.variation24h,
              creationBlock: item?.creationBlock,
              image: imageToken
            }
            await prisma.rank_tokens.create({
              data: {
                ...loserData
              }
            })
          }
        })
      })
      console.log('[GAINERS_LOSERS] Cron job executed successfully')
    } catch (e) {
      console.log(e)
    }
  }

  static async analyzeWallet() {
    console.log('[CRON ANALYZER] Start analyzer')
    try {
      let task = await prisma.walletAnalyzer.findFirst({
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          created_at: 'asc'
        }
      })

      if (!task) {
        console.log('[CRON ANALYZER] All tasks is completed')
        return
      }

      task.transactions = task.transactions ? JSON.parse(task.transactions, false) : []
      task.historical_prices = task.historical_prices ? JSON.parse(task.historical_prices) : []
      task.actual_prices = task.actual_prices ? JSON.parse(task.actual_prices) : []
      if (!task.transactions.length) {
        //getTransactions && update task
        const transactions = await getTransactions(task.wallet_address, task.time_period)
        await prisma.walletAnalyzer.update({
          where: {
            id: task.id
          },
          data: {
            transactions: JSON.stringify(transactions)
          }
        })
        task.transactions = transactions
      }

      if (!task.transactions.length) {
        await prisma.walletAnalyzer.update({
          where: {
            id: task.id
          },
          data: {
            status: 'COMPLETE'
          }
        })
        console.log('[CRON ANALYZER] Stop analyzer')
        $bot.sendMessage(
          task.user_id,
          'Your analyze for wallet: ' +
            task.wallet_address +
            ' for time period: ' +
            task.time_period +
            ' is complete. Check results in analyze bot section.'
        )
        return
      }

      if (!task.historical_prices.length) {
        // getHistoricalPrices && update task

        const _tokenDataForGetPrices = []

        task.transactions.forEach((transaction) => {
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
        let tokenHistoricalPrices = []
        chunkArray(_tokenDataForGetPrices, 25).forEach(async (chunk) => {
          tokenHistoricalPrices = [
            ...tokenHistoricalPrices,
            ...((await getShitcoinHistoricalMultiplePrices(chunk)) || [])
          ]
          delay(1000)
        })

        if (!tokenHistoricalPrices.length) {
          console.log(
            '[CRON ANALYZER] Cannot get historical prices for wallet: ' +
              task.wallet_address +
              ' for time period: ' +
              task.time_period
          )
          return
        }
        await prisma.walletAnalyzer.update({
          where: {
            id: task.id
          },
          data: {
            historical_prices: JSON.stringify(tokenHistoricalPrices)
          }
        })
        task.historical_prices = tokenHistoricalPrices
      }

      //temp arrays
      const _tokenPricesData = {}
      const transactionsTokens = []

      //Generate prices array by token and block
      task.historical_prices.forEach((token) => {
        if (!_tokenPricesData[token.tokenAddress]) {
          _tokenPricesData[token.tokenAddress] = {}
        }
        _tokenPricesData[token.tokenAddress][token.toBlock] = {
          usdPrice: token.usdPrice,
          usdPriceFormatted: token.usdPriceFormatted
        }
      })

      task.transactions.forEach((transaction) => {
        const { contractAddress, tokenDecimal, tokenName, tokenSymbol } = transaction
        const side =
          transaction.from.toLocaleLowerCase() === task.wallet_address.toLocaleLowerCase()
            ? 'SELL'
            : 'BUY'

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
        let _tokenActualPrices = []
        chunkArray(_caForPrices, 25).forEach(async (chunk) => {
          _tokenActualPrices = [
            ..._tokenActualPrices,
            ...(await getShitcoinHistoricalMultiplePrices(chunk))
          ]
          delay(1000)
        })
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
      Object.values(transactionsTokens).filter(
        (token) => token.PnL !== 0 || token.unrealizedPnL !== 0
      )

      await prisma.walletAnalyzer.update({
        where: {
          id: task.id
        },
        data: {
          status: 'COMPLETE',
          result: JSON.stringify(Object.values(transactionsTokens))
        }
      })
      $bot.sendMessage(
        task.user_id,
        'Your analyze for wallet: ' +
          task.wallet_address +
          ' for time period: ' +
          task.time_period +
          ' is complete. Check results in analyze bot section.'
      )
      console.log(
        '[CRON ANALYZER]Complete analyze for wallet: ' +
          task.wallet_address +
          ' for time period: ' +
          task.time_period
      )
    } catch (e) {
      console.log(e)
    }
  }

  static async scrapTransfers() {
    // try {
    const res = await prisma.settings.findFirst({
      where: {
        slug: 'alchemy_pageKey'
      },
      select: {
        value: true
      }
    })
    const pageKey = res?.value || null
    const blockFrom = '0x11BCFBF'

    const alchemyParams = {
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [
        {
          fromBlock: blockFrom,
          toBlock: 'latest',
          excludeZeroValue: true,
          withMetadata: true,
          maxCount: '0x3e8',
          category: [
            AssetTransfersCategory.ERC20,
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.EXTERNAL
          ]
        }
      ]
    }
    if (pageKey) {
      alchemyParams.params[0].pageKey = pageKey
    }
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    try {
      const response = await axios.post(
        'https://eth-mainnet.g.alchemy.com/v2/-RrNuO2ogSva9S90IuTGcbzWTeckazLx',
        alchemyParams,
        headers
      )
      let arTransactions = []
      let arTokens = []
      let arBlocks = []
      if (response?.data?.result?.transfers) {
        const transfers = response.data.result.transfers
        transfers.forEach(async (transfer) => {
          arBlocks[transfer.blockNum] = {
            blockNumber: parseInt(transfer.blockNum, 16),
            blockHash: transfer.hash,
            timestamp: transfer?.metadata?.blockTimestamp,
            chain: 'eth'
          }
          if (transfer.rawContract?.address && transfer.asset) {
            arTokens[transfer.rawContract?.address] = {
              address: transfer.rawContract?.address,
              symbol: transfer.asset,
              name: transfer.asset
            }
          }
          arTransactions[transfer.hash] = {
            blockNumber: parseInt(transfer.blockNum, 16),
            fromAddress: transfer.from,
            toAddress: transfer.to,
            amount: transfer.value,
            transactionHash: transfer.hash,
            block_number: transfer.blockNum,
            token_address: transfer.rawContract?.address
          }
        })

        await Object.values(arBlocks).forEach(async (block) => {
          try {
            await prisma.block.upsert({
              where: {
                blockNumber: block.blockNumber
              },
              create: {
                blockNumber: block.blockNumber,
                blockHash: block.blockHash,
                timestamp: block.timestamp,
                chain: block.chain
              },
              update: {
                blockHash: block.blockHash,
                timestamp: block.timestamp,
                chain: block.chain
              }
            })
          } catch (err) {
            console.log('[CRON ERROR][SCRAP TRANSFERS] The problem with creating block: ' + err)
          }
        })

        await Object.values(arTokens).forEach(async (token) => {
          const db_token = await prisma.token.findFirst({
            where: {
              address: token.address
            }
          })

          if (!db_token) {
            try {
              await prisma.token.create({
                data: {
                  address: token.address,
                  symbol: token.symbol,
                  name: token.name
                }
              })
            } catch (err) {
              console.log('[CRON ERROR][SCRAP TRANSFERS] The problem with creating token: ' + err)
            }
          }
        })
        await Object.values(arTransactions).forEach(async (transaction) => {
          if (transaction.token_address) {
            const token = await prisma.token.findFirst({
              where: {
                address: transaction.token_address
              }
            })
            const block = await prisma.block.findFirst({
              where: {
                blockNumber: transaction.blockNumber
              }
            })
            if (token && block) {
              try {
                await prisma.transaction.create({
                  data: {
                    token_id: token.id,
                    block_id: block.blockNumber,
                    transactionHash: transaction.transactionHash,
                    fromAddress: transaction.fromAddress,
                    toAddress: transaction.toAddress,
                    amount: transaction.amount
                  }
                })
              } catch (err) {
                console.log(
                  '[CRON ERROR][SCRAP TRANSFERS] The problem with creating transaction: ' + err
                )
              }
            }
          }
        })
        try {
          await prisma.settings.upsert({
            where: {
              slug: 'alchemy_pageKey'
            },
            create: {
              slug: 'alchemy_pageKey',
              value: response.data.result.pageKey
            },
            update: {
              value: response.data.result.pageKey
            }
          })
        } catch (err) {
          console.log('[CRON ERROR][SCRAP TRANSFERS] The problem with update page: ' + err)
        }
      }
    } catch (err) {
      console.log('[CRON ERROR][SCRAP TRANSFERS] Error: ' + err)
    }
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function chunkArray(array, chunkSize) {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}
