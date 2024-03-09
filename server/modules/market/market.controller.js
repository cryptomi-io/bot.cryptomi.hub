import { PrismaClient } from '@prisma/client'
import { validationResult } from 'express-validator'
import { useDextools } from '../../common/hooks/useDextools.js'

const { getTokenInfoByAddress, getTokenAuditByAddress } = useDextools()

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

    let db_token = await prisma.token.findFirst({
      where: {
        address: address
      }
    })
    //Try to get token from db
    if (!db_token) {
      const token_info_res = await getTokenInfoByAddress(chain, address)

      console.log(token_info_res)

      if (!token_info_res) {
        return res.status(400).json({ status: 'Token not found' })
      }

      db_token = await prisma.token.create({
        data: {
          address: token_info_res?.address,
          symbol: token_info_res?.symbol,
          name: token_info_res?.name,
          exchange: '',
          factory: ''
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

    res.json({ status: 'success', data: token })
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
