import { PrismaClient } from '@prisma/client'
import { validationResult } from 'express-validator'

const prisma = new PrismaClient()

export class AnalyzerController {
  async getAll(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { user_id } = req.params

    const response = await prisma.walletAnalyzer.findMany({
      where: {
        user_id: user_id.toString()
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    res.json({ status: 'success', data: response })
  }
  async getOne(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { id } = req.params

    let response = await prisma.walletAnalyzer.findUnique({
      where: {
        id: +id
      }
    })
    response = {
      ...response,
      transactions: JSON.parse(response.transactions),
      historical_prices: JSON.parse(response.historical_prices),
      result: JSON.parse(response.result)
    }
    res.json({ status: 'success', data: response })
  }
  async create(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { time_period, wallet_address, user_id } = req.body

    const existTask = await prisma.walletAnalyzer.findFirst({
      where: {
        user_id: user_id.toString(),
        wallet_address,
        status: 'ACTIVE'
      }
    })
    if (existTask) {
      return res.status(400).json({ errors: 'Task already exists' })
    }

    try {
      const response = await prisma.walletAnalyzer.create({
        data: {
          user_id: user_id.toString(),
          time_period,
          wallet_address
        }
      })

      res.json({ status: 'success', data: response })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ errors: errors.array() })
    }
  }

  async getTaskTransaction(wallet_address, time_period) {}
}
