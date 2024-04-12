import { Router } from 'express'
import { check } from 'express-validator'
import { PresaleController } from './presale.controller.js'

const presaleRouter = new Router()
const controller = new PresaleController()

// Ваши маршруты
presaleRouter.get('/price/:currency', controller.getPrice)
presaleRouter.get('/transactions/last', controller.getLastTransaction)
presaleRouter.get('/rate', controller.getRate)
presaleRouter.post(
  '/transaction',
  [
    check('user_id').notEmpty(),
    check('wallet_address').notEmpty(),
    check('amount').notEmpty(),
    check('ctmiPrice').notEmpty(),
    check('price_usdt').notEmpty(),
    check('price_ton').notEmpty()
  ],
  controller.createTransaction
)

export default presaleRouter
