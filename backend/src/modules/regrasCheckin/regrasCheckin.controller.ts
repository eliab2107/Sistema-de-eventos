import { Request, Response } from 'express'
import regrasCheckinService from './regrasCheckin.service'

class RegrasCheckinController {
  async list(req: Request, res: Response) {
    try {
      const { eventoId } = req.params as { eventoId: string }
      const regras = await regrasCheckinService.list(eventoId)
      res.json(regras)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { eventoId } = req.params as { eventoId: string }
      const { nome, minutosAntes, minutosDepois, obrigatorio, ativa } = req.body

      if (!nome || minutosAntes === undefined || minutosDepois === undefined) {
        return res.status(400).json({ message: 'nome, minutosAntes and minutosDepois are required' })
      }

      const regra = await regrasCheckinService.create(eventoId, {
        nome,
        minutosAntes,
        minutosDepois,
        obrigatorio: obrigatorio ?? true,
        ativa: ativa ?? true
      })

      res.status(201).json(regra)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { eventoId, id } = req.params as { eventoId: string; id: string }
      const { nome, minutosAntes, minutosDepois, obrigatorio, ativa } = req.body

      const regra = await regrasCheckinService.update(eventoId, id, {
        nome,
        minutosAntes,
        minutosDepois,
        obrigatorio,
        ativa
      })

      res.json(regra)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { eventoId, id } = req.params as { eventoId: string; id: string }
      await regrasCheckinService.delete(eventoId, id)
      res.status(204).send()
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new RegrasCheckinController()
