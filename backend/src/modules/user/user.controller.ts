import { Request, Response } from 'express'
import userService from './user.service'

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { email, password, nome } = req.body
      const user = await userService.create({ email, password, nome })
      res.status(201).json(user)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new UserController()
