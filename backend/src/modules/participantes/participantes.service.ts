import prisma from '../../prisma'

interface ParticipanteResponse {
  id: string
  nome: string
  email: string
}

interface InscricaoResponse {
  id: string
  eventoId: string
  participanteId: string
  checkIn: boolean
  dataInscricao: string
}

function mapParticipante(participante: any): ParticipanteResponse {
  return {
    id: participante.id,
    nome: participante.nome,
    email: participante.email
  }
}

function mapInscricao(inscricao: any): InscricaoResponse {
  return {
    id: inscricao.id,
    eventoId: inscricao.eventoId,
    participanteId: inscricao.participanteId,
    checkIn: inscricao.checkIn,
    dataInscricao: inscricao.dataInscricao.toISOString()
  }
}

class ParticipantesService {
  async list(): Promise<ParticipanteResponse[]> {
    const participantes = await prisma.participante.findMany()
    return participantes.map(mapParticipante)
  }

  async create(data: { nome: string; email: string }): Promise<ParticipanteResponse> {
    // Check if email already exists
    const existing = await prisma.participante.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      throw { statusCode: 400, message: 'Email already registered' }
    }

    const participante = await prisma.participante.create({
      data: {
        nome: data.nome,
        email: data.email
      }
    })

    return mapParticipante(participante)
  }

  async update(id: string, data: { nome?: string; email?: string }): Promise<ParticipanteResponse> {
    // Check if exists
    const existing = await prisma.participante.findUnique({
      where: { id }
    })

    if (!existing) {
      throw { statusCode: 404, message: 'Participante not found' }
    }

    if (data.email && data.email !== existing.email) {
      const emailTaken = await prisma.participante.findUnique({
        where: { email: data.email }
      })

      if (emailTaken) {
        throw { statusCode: 400, message: 'Email already registered' }
      }
    }

    const updateData: any = {}
    if (data.nome) updateData.nome = data.nome
    if (data.email) updateData.email = data.email

    const participante = await prisma.participante.update({
      where: { id },
      data: updateData
    })

    return mapParticipante(participante)
  }

  async delete(id: string): Promise<void> {
    // Check if exists
    const existing = await prisma.participante.findUnique({
      where: { id }
    })

    if (!existing) {
      throw { statusCode: 404, message: 'Participante not found' }
    }

    await prisma.participante.delete({
      where: { id }
    })
  }

  async inscrever(participanteId: string, eventoId: string): Promise<InscricaoResponse> {

    const participante = await prisma.participante.findUnique({
      where: { id: participanteId }
    })

    if (!participante) {
      throw { statusCode: 404, message: 'Participante not found' }
    }

    // Check if evento exists
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId }
    })

    if (!evento) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    const existing = await prisma.inscricao.findUnique({
      where: {
        eventoId_participanteId: {
          eventoId,
          participanteId
        }
      }
    })

    if (existing) {
      throw { statusCode: 400, message: 'Participante already inscribed in this event' }
    }

    const inscricao = await prisma.inscricao.create({
      data: {
        eventoId,
        participanteId
      }
    })

    return mapInscricao(inscricao)
  }

  async transferir(participanteId: string, eventoOrigemId: string, eventoDestinoId: string): Promise<InscricaoResponse> {
    const participante = await prisma.participante.findUnique({
      where: { id: participanteId }
    })

    if (!participante) {
      throw { statusCode: 404, message: 'Participante not found' }
    }

    
    const eventoOrigem = await prisma.evento.findUnique({
      where: { id: eventoOrigemId }
    })

    if (!eventoOrigem) {
      throw { statusCode: 404, message: 'Origem evento not found' }
    }

   
    const eventoDestino = await prisma.evento.findUnique({
      where: { id: eventoDestinoId }
    })

    if (!eventoDestino) {
      throw { statusCode: 404, message: 'Destino evento not found' }
    }

    
    const inscricaoOrigem = await prisma.inscricao.findUnique({
      where: {
        eventoId_participanteId: {
          eventoId: eventoOrigemId,
          participanteId
        }
      }
    })

    if (!inscricaoOrigem) {
      throw { statusCode: 400, message: 'Participante is not inscribed in origem evento' }
    }

    
    const inscricaoDestino = await prisma.inscricao.findUnique({
      where: {
        eventoId_participanteId: {
          eventoId: eventoDestinoId,
          participanteId
        }
      }
    })

    if (inscricaoDestino) {
      throw { statusCode: 400, message: 'Participante is already inscribed in destino evento' }
    }

   
    await prisma.inscricao.delete({
      where: { id: inscricaoOrigem.id }
    })

    const novaInscricao = await prisma.inscricao.create({
      data: {
        eventoId: eventoDestinoId,
        participanteId
      }
    })

    return mapInscricao(novaInscricao)
  }

  async checkin(participanteId: string, eventoId: string, checkIn: boolean): Promise<InscricaoResponse> {
    
    const inscricao = await prisma.inscricao.findUnique({
      where: {
        eventoId_participanteId: {
          eventoId,
          participanteId
        }
      }
    })

    if (!inscricao) {
      throw { statusCode: 404, message: 'Inscricao not found' }
    }

    const updated = await prisma.inscricao.update({
      where: { id: inscricao.id },
      data: { checkIn }
    })

    return mapInscricao(updated)
  }
}

export default new ParticipantesService()
