import { Router } from 'express'
import { UserController } from './user.controller.js'

const userRouter = new Router()
const controller = new UserController()

userRouter.get('/test', controller.test)

export default userRouter
