import { Router } from 'express'
import { check } from 'express-validator'
import { MarketController } from './market.controller.js'

const marketRouter = new Router()
const controller = new MarketController()

// Ваши маршруты
marketRouter.get(
  '/info/:chain/:type',
  [check('chain').notEmpty(), check('type').notEmpty()],
  controller.getMarkets
)

marketRouter.get(
  '/token/:chain/:address',
  [check('chain').notEmpty(), check('address').notEmpty()],
  controller.getTokenInfo
)

marketRouter.get(
  '/info/top',
  controller.getTop
)


export default marketRouter
