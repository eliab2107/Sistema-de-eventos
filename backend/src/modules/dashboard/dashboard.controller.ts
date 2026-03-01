import { Request, Response } from 'express'
import dashboardService from './dashboard.service'

class DashboardController {
  async get(req: Request, res: Response) {
    try {
      const data = await dashboardService.getDashboard()
      res.json(data)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new DashboardController()
