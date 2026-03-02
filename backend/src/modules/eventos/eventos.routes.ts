import { Router } from 'express'
import eventosController from './eventos.controller'
import authMiddleware from '../../middleware/auth.middleware'

const router = Router()

// Protect todas as rotas de eventos
router.get('/', authMiddleware, (req, res) => eventosController.list(req, res))
router.get('/:id/completo', authMiddleware, (req, res) => eventosController.getCompleto(req, res))
router.get('/:id', authMiddleware, (req, res) => eventosController.getById(req, res))
router.post('/', authMiddleware, (req, res) => eventosController.create(req, res))
router.put('/:id', authMiddleware, (req, res) => eventosController.update(req, res))
router.delete('/:id', authMiddleware, (req, res) => eventosController.delete(req, res))

export default router
