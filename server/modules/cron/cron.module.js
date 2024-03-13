import cron from 'node-cron'
import { CronController } from './cron.controller.js'

export class CronSchedule {
  static run() {
    this.updateMarkets()
    this.analyzeWallet()
  }
  static updateMarkets() {
    cron.schedule('*/2 * * * *', () => {
      CronController.updateMarkets()
    })
  }

  static analyzeWallet() {
    cron.schedule('* * * * *', () => {
      CronController.analyzeWallet()
    })
  }
}
