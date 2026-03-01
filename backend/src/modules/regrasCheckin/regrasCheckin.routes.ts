import { Router } from 'express'
import regrasCheckinController from './regrasCheckin.controller'

const router = Router()

router.get('/:eventoId/regras-checkin', (req, res) => regrasCheckinController.list(req, res))


router.post('/:eventoId/regras-checkin', (req, res) => regrasCheckinController.create(req, res))

router.put('/:eventoId/regras-checkin/:id', (req, res) => regrasCheckinController.update(req, res))


router.delete('/:eventoId/regras-checkin/:id', (req, res) => regrasCheckinController.delete(req, res))

export default router
