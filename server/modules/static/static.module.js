import { Router } from 'express'
import { StaticController } from './static.controller.js'

const staticRouter = new Router()
const controller = new StaticController()

// Ваши маршруты
staticRouter.get(
  '/image/:filename',
  controller.getImage
)

export default staticRouter
