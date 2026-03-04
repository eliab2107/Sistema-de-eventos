import { Request, Response } from 'express'
import eventosService from './eventos.service'
import { AuthRequest } from '../../middleware/auth.middleware'

interface ListQuery {
  nome?: string
  status?: string
  local?: string
  dataInicial?: string
  dataFinal?: string
}

class EventosController {
  async list(req: Request, res: Response) {
    try {
      const filters = req.query as ListQuery
      const authReq = req as AuthRequest
      const userId = authReq.userId

      const eventos = await eventosService.list(filters, userId!)
      res.json(eventos)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async getByCreator(req: Request, res: Response) {
    try {
      const { idCreator } = req.params as { idCreator: string }
      const authReq = req as AuthRequest
      const userId = authReq.userId

      const eventos = await eventosService.listByCreator(idCreator, userId!)
      res.json(eventos)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const authReq = req as AuthRequest
      const userId = authReq.userId

      const evento = await eventosService.getById(id, userId!)
      res.json(evento)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nome, data, local, status } = req.body
      const authReq = req as AuthRequest
      const userId = authReq.userId

      if (!nome || !data || !local || !status) {
        return res.status(400).json({ message: 'nome, data, local and status are required' })
      }

      const evento = await eventosService.create({ nome, data, local, status }, userId!)
      res.status(201).json(evento)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const { nome, data, local, status } = req.body
      const authReq = req as AuthRequest
      const userId = authReq.userId

      const evento = await eventosService.update(id, { nome, data, local, status }, userId!)
      res.json(evento)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const authReq = req as AuthRequest
      const userId = authReq.userId
      await eventosService.delete(id, userId!)
      res.status(204).send()
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async getCompleto(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const authReq = req as AuthRequest
      const userId = authReq.userId
      const eventoCompleto = await eventosService.getCompleto(id, userId!)
      res.json(eventoCompleto)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

    async removeInscricao(req: Request, res: Response) {
      try {
        const { eventoId, inscricaoId } = req.params as { eventoId: string; inscricaoId: string }
        const authReq = req as AuthRequest
        const userId = authReq.userId

        await eventosService.removeInscricao(eventoId, inscricaoId, userId!)
        res.status(204).send()
      } catch (error: any) {
        if (error.statusCode) {
          return res.status(error.statusCode).json({ message: error.message })
        }
        res.status(500).json({ message: 'Internal server error' })
      }
    }
}

export default new EventosController()
