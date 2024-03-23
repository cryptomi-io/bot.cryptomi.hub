import cron from 'node-cron'
import { CronController } from './cron.controller.js'

CronController.scrapTransfers()


export class CronSchedule {
  static run() {
    this.updateMarkets()
    // this.analyzeWallet()
    this.scrapTransfers()
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
  static scrapTransfers() {
    cron.schedule('* * * * *', () => {
      CronController.scrapTransfers()
    })
  }
}
