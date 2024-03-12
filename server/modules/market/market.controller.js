import { PrismaClient } from '@prisma/client'
import { validationResult } from 'express-validator'
import { useDextools } from '../../common/hooks/useDextools.js'

const { getTokenInfoByAddress, getTokenAuditByAddress, getImageToken } = useDextools()

const prisma = new PrismaClient()

export class MarketController {
  async getMarkets(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { chain, type } = req.params

    const response = await prisma.rank_tokens.findMany({
      where: {
        side: type,
        chain: chain
      },
      include: {
        token: true
      },
      orderBy: [
        {
          rank: 'asc'
        }
      ]
    })

    res.json({ status: 'success', data: response })
  }

  async getTokenInfo(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { address, chain } = req.params

    let token = null
    let isUpdateInfo = false
    let isUpdateImage = false
    let db_token = await prisma.token.findFirst({
      where: {
        address: address
      },
      include: {
        rank_tokens: true
      }
    })
    //Try to get token from db
    if (!db_token) {
      const token_info_res = await getTokenInfoByAddress(chain, address)

      console.log(token_info_res)

      if (!token_info_res) {
        return res.status(400).json({ status: 'Token not found' })
      }

      const imageToken = await getImageToken(
        'https://www.dextools.io/resources/tokens/logos/' + chain + '/' + address + '.png',
        chain
      )
      console.log('first upload')
      db_token = await prisma.token.create({
        data: {
          address: token_info_res?.address,
          symbol: token_info_res?.symbol,
          name: token_info_res?.name,
          exchange: '',
          factory: '',
          image: imageToken
        }
      })
    }

    token = {
      ...db_token,
      additional_info: db_token?.additional_info ? JSON.parse(db_token.additional_info) : null
    }

    //if token doesn't has additional info.info
    if (!token?.additional_info?.info || !Object.values(token?.additional_info?.info).length) {
      await delay(1000)
      const info_response = await getTokenInfoByAddress(chain, address)
      token.additional_info = {
        ...token.additional_info,
        info: info_response
      }
      isUpdateInfo = true
    }
    if (!token?.additional_info?.audit || !Object.values(token?.additional_info?.audit).length) {
      await delay(1000)
      const audit_response = await getTokenAuditByAddress(chain, address)
      token.additional_info = {
        ...token.additional_info,
        audit: audit_response
      }
      isUpdateInfo = true
    }

    if (isUpdateInfo) {
      await prisma.token.update({
        where: {
          id: token.id
        },
        data: {
          additional_info: JSON.stringify(token.additional_info)
        }
      })
    }

    const updateImageToken = await getImageToken(
      'https://www.dextools.io/resources/tokens/logos/' + chain + '/' + address + '.png',
      chain
    )
    if (updateImageToken) {
      token = {
        ...db_token,
        image: updateImageToken
      }
      isUpdateImage = true
      console.log('update upload ' + isUpdateImage)
    }
    if (isUpdateImage) {
      console.log(JSON.stringify(token))
    }
    if (isUpdateImage) {
      await prisma.token.update({
        where: {
          id: token.id
        },
        data: {
          image: token.image
        }
      })
    }

    res.json({ status: 'success', data: token })
  }

  async getTop(req, res) {
    const tokens = await prisma.rank_tokens.findMany({
      where: {
        side: 'gainer'
      },
      include: {
        token: true
      },
      orderBy: [
        {
          variation24h: 'desc'
        }
      ],
      take: 30
    })
    res.json({ status: 'success', data: tokens })
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
