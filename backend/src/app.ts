import express from 'express'
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/user/user.routes'
import eventosRoutes from './modules/eventos/eventos.routes'
import participantesRoutes from './modules/participantes/participantes.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import regrasCheckinRoutes from './modules/regrasCheckin/regrasCheckin.routes'
import authMiddleware from './middleware/auth.middleware'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Public routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)  // registration

// Protected routes
//app.use(authMiddleware)
app.use('/eventos', authMiddleware,eventosRoutes)
app.use('/participantes', authMiddleware, participantesRoutes)
app.use('/dashboard', authMiddleware, dashboardRoutes)
app.use('/eventos', authMiddleware, regrasCheckinRoutes)

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  res.status(500).json({ message: 'Internal server error' })
})

export default app
