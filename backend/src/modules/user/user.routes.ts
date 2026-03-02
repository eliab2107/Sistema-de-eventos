import { Router } from 'express'
import userController from './user.controller'

const router = Router()

// registration route
router.post('/', (req, res) => userController.create(req, res))

export default router
