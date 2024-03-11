import { PrismaClient } from '@prisma/client'
import { useDextools } from '../../common/hooks/useDextools.js'
const { getGainers, getLosers, getImageToken } = useDextools()
const prisma = new PrismaClient()
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
          const imageToken = await getImageToken('https://www.dextools.io/resources/tokens/logos/'+chain.id+'/'+item.mainToken.address+'.png', chain.id);
          //console.log('https://www.dextools.io/resources/tokens/logos/'+chain.id+'/'+item.mainToken.address+'.png')
          const tokenData = {
            address: item.mainToken.address,
            name: item.mainToken.name,
            symbol: item.mainToken.symbol,
            exchange: item.exchange.name,
            factory: item.exchange.factory,
            image: imageToken,
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
              image: imageToken,
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
          const imageToken = await getImageToken('https://www.dextools.io/resources/tokens/logos/'+chain.id+'/'+item.mainToken.address+'.png', chain.id);
         
          const tokenData = {
            address: item.mainToken.address,
            name: item.mainToken.name,
            symbol: item.mainToken.symbol,
            exchange: item.exchange.name,
            factory: item.exchange.factory,
            image: imageToken,
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
              image: imageToken,
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
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
