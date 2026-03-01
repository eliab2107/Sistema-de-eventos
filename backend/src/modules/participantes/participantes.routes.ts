import { Router } from 'express'
import participantesController from './participantes.controller'

const router = Router()

router.get('/', (req, res) => participantesController.list(req, res))
router.post('/', (req, res) => participantesController.create(req, res))
router.put('/:id', (req, res) => participantesController.update(req, res))
router.delete('/:id', (req, res) => participantesController.delete(req, res))

// Custom endpoints
router.post('/:id/inscrever', (req, res) => participantesController.inscrever(req, res))
router.put('/:id/transferir', (req, res) => participantesController.transferir(req, res))
router.put('/:id/checkin', (req, res) => participantesController.checkin(req, res))

export default router
