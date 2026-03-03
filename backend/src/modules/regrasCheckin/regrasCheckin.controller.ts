import { Request, Response } from 'express'
import regrasCheckinService from './regrasCheckin.service'
import { AuthRequest } from '../../middleware/auth.middleware'

class RegrasCheckinController {
  async list(req: Request, res: Response) {
    try {
      const { eventoId } = req.params as { eventoId: string }
      const authReq = req as AuthRequest
      const userId = authReq.userId
      const regras = await regrasCheckinService.list(eventoId, userId!)
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
      const authReq = req as AuthRequest
      const userId = authReq.userId
      const { tipoRegraId, nome, minutosAntes, minutosDepois, obrigatorio, ativa } = req.body

      if (!tipoRegraId || minutosAntes === undefined || minutosDepois === undefined) {
        return res.status(400).json({ message: 'tipoRegraId, minutosAntes and minutosDepois are required' })
      }

      const regra = await regrasCheckinService.create(eventoId, userId!, {
        tipoRegraId,
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
      const authReq = req as AuthRequest
      const userId = authReq.userId
      const { tipoRegraId, nome, minutosAntes, minutosDepois, obrigatorio, ativa } = req.body

      const regra = await regrasCheckinService.update(eventoId, id, userId!, {
        tipoRegraId,
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
      const authReq = req as AuthRequest
      const userId = authReq.userId
      await regrasCheckinService.delete(eventoId, id, userId!)
      res.status(204).send()
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async listTipos(req: Request, res: Response) {
    try {
      const tipos = await regrasCheckinService.listTipos()
      res.json(tipos)
    } catch (error: any) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new RegrasCheckinController()
