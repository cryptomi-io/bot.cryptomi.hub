import { Router } from 'express'
import { check } from 'express-validator'
import { AnalyzerController } from './analyzer.controller.js'

const marketRouter = new Router()
const controller = new AnalyzerController()

marketRouter.get('/:user_id', [check('user_id').notEmpty()], controller.getAll)

marketRouter.post(
  '/',
  [
    check('wallet_address').notEmpty(),
    check('time_period').notEmpty(),
    check('user_id').notEmpty()
  ],
  controller.create
)

marketRouter.get('/task/:id/', [check('id').notEmpty()], controller.getOne)

export default marketRouter
