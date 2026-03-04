import { Router } from 'express'
import participantesController from './participantes.controller'
import authMiddleware from '../../middleware/auth.middleware'

const router = Router()

router.get('/', (req, res) => participantesController.list(req, res))
router.post('/', (req, res) => participantesController.create(req, res))
router.put('/:id', (req, res) => participantesController.update(req, res))
router.delete('/:id', (req, res) => participantesController.delete(req, res))

// Custom endpoints - require auth because they operate on eventos
router.post('/:id/inscrever', authMiddleware, (req, res) => participantesController.inscrever(req, res))
router.put('/:id/transferir', authMiddleware, (req, res) => participantesController.transferir(req, res))
router.put('/:id/checkin', authMiddleware, (req, res) => participantesController.checkin(req, res))

router.get('/creator/:idCreator', (req, res) => participantesController.getByIdCreator(req, res))

export default router
