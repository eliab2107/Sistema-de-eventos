import { Router } from 'express'
import dashboardController from './dashboard.controller'

const router = Router()

router.get('/', (req, res) => dashboardController.get(req, res))

export default router
