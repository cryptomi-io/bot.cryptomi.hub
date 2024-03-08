
import cron from 'node-cron'
import { CronController } from './cron.controller.js'


CronController.updateMarkets()
export class CronSchedule {
  
  
  static run() {
    this.updateMarkets()      
  }
  static updateMarkets() {
    cron.schedule('*/2 * * * *', () => {
      CronController.updateMarkets()
    })
  }
}