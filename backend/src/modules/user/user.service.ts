import bcryptjs from 'bcryptjs'
import prisma from '../../prisma'

interface CreateUserRequest {
  email: string
  password: string
  nome: string
}

interface UserResponse {
  id: string
  email: string
  nome: string
}

function mapUser(user: any): UserResponse {
  return {
    id: user.id,
    email: user.email,
    nome: user.nome
  }
}

class UserService {
  async create(data: CreateUserRequest): Promise<UserResponse> {
    // check required
    if (!data.email || !data.password || !data.nome) {
      const err: any = new Error('email, password and nome are required')
      err.statusCode = 400
      throw err
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    })
    if (existing) {
      const err: any = new Error('Email already registered')
      err.statusCode = 400
      throw err
    }

    const hashed = await bcryptjs.hash(data.password, 10)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        nome: data.nome
      }
    })
    return mapUser(user)
  }
}

export default new UserService()
