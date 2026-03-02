import { Router } from 'express'
import dashboardController from './dashboard.controller'
import authMiddleware from '../../middleware/auth.middleware'

const router = Router()

router.get('/', authMiddleware, (req, res) => dashboardController.get(req, res))

export default router
