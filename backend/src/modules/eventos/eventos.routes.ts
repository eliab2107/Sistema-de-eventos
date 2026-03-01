import { Router } from 'express'
import eventosController from './eventos.controller'

const router = Router()

router.get('/', (req, res) => eventosController.list(req, res))
router.get('/:id/completo', (req, res) => eventosController.getCompleto(req, res))
router.get('/:id', (req, res) => eventosController.getById(req, res))
router.post('/', (req, res) => eventosController.create(req, res))
router.put('/:id', (req, res) => eventosController.update(req, res))
router.delete('/:id', (req, res) => eventosController.delete(req, res))

export default router
