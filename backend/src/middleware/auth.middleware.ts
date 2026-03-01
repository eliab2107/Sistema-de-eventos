import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Missing token' })
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret'
    const decoded = jwt.verify(token, secret) as { userId: string; email: string }
    
    req.userId = decoded.userId
    req.userEmail = decoded.email
    
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export default authMiddleware
export type { AuthRequest }
