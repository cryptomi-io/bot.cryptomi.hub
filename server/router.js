import { Router } from 'express'
import marketRouter from './modules/market/market.module.js'
import userRouter from './modules/user/user.module.js'

const router = new Router()

router.use('/user', userRouter)
router.use('/market', marketRouter)

export default router
