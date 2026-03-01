import { Request, Response } from 'express'
import eventosService from './eventos.service'

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

      const eventos = await eventosService.list(filters)
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
      const evento = await eventosService.getById(id)
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

      if (!nome || !data || !local || !status) {
        return res.status(400).json({ message: 'nome, data, local and status are required' })
      }

      const evento = await eventosService.create({ nome, data, local, status })
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

      const evento = await eventosService.update(id, { nome, data, local, status })
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
      await eventosService.delete(id)
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
      const eventoCompleto = await eventosService.getCompleto(id)
      res.json(eventoCompleto)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new EventosController()
