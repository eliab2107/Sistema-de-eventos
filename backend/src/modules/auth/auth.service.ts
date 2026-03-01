import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../prisma'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
  }
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' }
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password)

    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid credentials' }
    }

    // Generate token
    const secret = process.env.JWT_SECRET || 'secret'
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '1h' }
    )

    return {
      token,
      user: {
        id: user.id,
        email: user.email
      }
    }
  }
}

export default new AuthService()
