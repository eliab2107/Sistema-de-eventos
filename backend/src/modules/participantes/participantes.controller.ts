import { Request, Response } from 'express'
import participantesService from './participantes.service'
import { AuthRequest } from '../../middleware/auth.middleware'

class ParticipantesController {
  async list(req: Request, res: Response) {
    try {
      const participantes = await participantesService.list()
      res.json(participantes)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nome, email, creatorId } = req.body

      if (!nome || !email || !creatorId) {
        return res.status(400).json({ message: 'nome, email and creatorId are required' })
      }

      const participante = await participantesService.create({ nome, email, creatorId })
      res.status(201).json(participante)
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
      const { nome, email } = req.body

      const participante = await participantesService.update(id, { nome, email })
      res.json(participante)
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
      await participantesService.delete(id)
      res.status(204).send()
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async inscrever(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const { eventoId } = req.body
      const authReq = req as AuthRequest
      const userId = authReq.userId

      if (!eventoId) {
        return res.status(400).json({ message: 'eventoId is required' })
      }

      const inscricao = await participantesService.inscrever(id, eventoId, userId!)
      res.status(201).json(inscricao)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async transferir(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const { eventoOrigemId, eventoDestinoId } = req.body
      const authReq = req as AuthRequest
      const userId = authReq.userId

      if (!eventoOrigemId || !eventoDestinoId) {
        return res.status(400).json({ message: 'eventoOrigemId and eventoDestinoId are required' })
      }

      const inscricao = await participantesService.transferir(id, eventoOrigemId, eventoDestinoId, userId!)
      res.json(inscricao)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async checkin(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const { eventoId, checkIn } = req.body
      const authReq = req as AuthRequest
      const userId = authReq.userId

      if (!eventoId || checkIn === undefined) {
        return res.status(400).json({ message: 'eventoId and checkIn are required' })
      }

      const inscricao = await participantesService.checkin(id, eventoId, checkIn, userId!)
      res.json(inscricao)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async getByIdCreator(req: Request, res: Response) {
    try {
      const { idCraetor } = req.params as { idCraetor: string }
      const participante = await participantesService.getByIdCreator(idCraetor)
      res.json(participante)
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new ParticipantesController()
