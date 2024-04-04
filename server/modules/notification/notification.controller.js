import dotenv from 'dotenv'
import { validationResult } from 'express-validator'
import TelegramBot from 'node-telegram-bot-api'
import process from 'process'
dotenv.config()

const token = process.env.TELEGRAM_BOT_TOKEN
const admin_chat_id = process.env.TELEGRAM_ADMIN_CHAT_ID

const $bot = new TelegramBot(token)

export class NotificationController {
  async sendAdmin(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { message } = req.body
    console.log(message)
    $bot.sendMessage(admin_chat_id, message, {
      parse_mode: 'HTML'
    })
    res.json({ status: 'success' })
  }
}
