import { Router } from 'express'
import regrasCheckinController from './regrasCheckin.controller'
import authMiddleware from '../../middleware/auth.middleware'

const router = Router()

router.get('/:eventoId/regras-checkin', authMiddleware, (req, res) => regrasCheckinController.list(req, res))

router.post('/:eventoId/regras-checkin', authMiddleware, (req, res) => regrasCheckinController.create(req, res))

router.put('/:eventoId/regras-checkin/:id', authMiddleware, (req, res) => regrasCheckinController.update(req, res))

router.delete('/:eventoId/regras-checkin/:id', authMiddleware, (req, res) => regrasCheckinController.delete(req, res))

export default router
