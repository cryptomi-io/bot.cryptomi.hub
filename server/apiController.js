import { validationResult } from 'express-validator'
import Analyzer from './src/Analyzer.js'

export class apiController {
  async analyze(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.errors[0].msg })
      }
      const { address, timePeriod } = req.body
      if (!timePeriod || timePeriod > 90) {
        res.status(400).json({ message: 'Error occured' })
      }

      let analyzer = new Analyzer(address, timePeriod)

      const start = Date.now()

      const result = await analyzer.parse_info(true)
      console.log('Done for ', (Date.now() - start) / 1000, ' seconds')

      return res.json(result)
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Error occured' })
    }
  }

  async test(req, res) {
    res.json('OK')
  }
}
