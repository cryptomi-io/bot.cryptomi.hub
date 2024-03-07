import { Router } from 'express'
import { apiController } from './apiController.js'

const router = new Router()
const controller = new apiController()

router.post('/analyze', controller.analyze)   

router.post('/test', controller.test)

export default router
