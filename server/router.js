import { Router } from 'express'
import analyzerRouter from './modules/analyzer/analyzer.module.js'
import marketRouter from './modules/market/market.module.js'
import userRouter from './modules/user/user.module.js'
import notificationRouter from './modules/notification/notification.module.js'
const router = new Router()

router.use('/user', userRouter)
router.use('/market', marketRouter)
router.use('/analyzer', analyzerRouter)
router.use('/notification', notificationRouter)

export default router
