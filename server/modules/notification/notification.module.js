import { Router } from 'express'
import { check } from 'express-validator'
import { NotificationController } from './notification.controller.js'

const notificationRouter = new Router()
const controller = new NotificationController()

// Ваши маршруты
notificationRouter.post('/send/admin', [check('message').notEmpty()], controller.sendAdmin)

export default notificationRouter
