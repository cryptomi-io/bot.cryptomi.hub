import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import process from 'process'
import { CronSchedule } from './modules/cron/cron.module.js'
import router from './router.js'
dotenv.config()

console.log(path.__dirname)
const app = express()
const PORT = process.env.PORT || 4005
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/api', router)
app.use('/static', express.static(path.join(process.cwd(), 'server', 'public', 'images')))


CronSchedule.run()

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}...`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
