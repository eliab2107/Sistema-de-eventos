import { Request, Response } from 'express'
import dashboardService from './dashboard.service'
import { AuthRequest } from '../../middleware/auth.middleware'

class DashboardController {
  async get(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest
      const userId = authReq.userId
      const data = await dashboardService.getDashboard(userId!)
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
