import prisma from '../../prisma'

interface RegraResponse {
  id: string
  nome: string
  minutosAntes: number
  minutosDepois: number
  obrigatorio: boolean
  ativa: boolean
  criadoEm: string
  eventoId: string
}

interface CreateRegraRequest {
  nome: string
  minutosAntes: number
  minutosDepois: number
  obrigatorio: boolean
  ativa: boolean
}

interface UpdateRegraRequest {
  nome?: string
  minutosAntes?: number
  minutosDepois?: number
  obrigatorio?: boolean
  ativa?: boolean
}

function mapRegra(regra: any): RegraResponse {
  return {
    id: regra.id,
    nome: regra.nome,
    minutosAntes: regra.minutosAntes,
    minutosDepois: regra.minutosDepois,
    obrigatorio: regra.obrigatorio,
    ativa: regra.ativa,
    criadoEm: regra.criadoEm.toISOString(),
    eventoId: regra.eventoId
  }
}

// Check if two mandatory rules have overlapping time intervals
function temConflito(regra1: { minutosAntes: number; minutosDepois: number }, regra2: { minutosAntes: number; minutosDepois: number }): boolean {
  // Interval 1: [-minutosAntes, +minutosDepois]
  // Interval 2: [-minutosAntes, +minutosDepois]
  
  // If no overlap: fim1 < inicio2 OR fim2 < inicio1
  // Overlap means: inicio1 <= fim2 AND inicio2 <= fim1
  
  const inicio1 = -regra1.minutosAntes
  const fim1 = regra1.minutosDepois
  const inicio2 = -regra2.minutosAntes
  const fim2 = regra2.minutosDepois
  
  return inicio1 <= fim2 && inicio2 <= fim1
}

class RegrasCheckinService {
  async list(eventoId: string, userId: string): Promise<RegraResponse[]> {
    // Check if evento exists
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId }
    })

    if (!evento || evento.creatorId !== userId) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    const regras = await prisma.regraEvento.findMany({
      where: { eventoId }
    })

    return regras.map(mapRegra)
  }

  async create(eventoId: string, userId: string, data: CreateRegraRequest): Promise<RegraResponse> {
    // Check if evento exists
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId }
    })
    if (!evento || evento.creatorId !== userId) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    // If this rule is mandatory, check for conflicts
    if (data.obrigatorio && data.ativa) {
      const outrasRegras = await prisma.regraEvento.findMany({
        where: {
          eventoId,
          obrigatorio: true,
          ativa: true
        }
      })

      for (const outra of outrasRegras) {
        if (temConflito(data, outra)) {
          throw {
            statusCode: 400,
            message: `Conflito detected com regra "${outra.nome}": interval [-${data.minutosAntes}, +${data.minutosDepois}] sobrepõe [-${outra.minutosAntes}, +${outra.minutosDepois}]`
          }
        }
      }
    }

    const regra = await prisma.regraEvento.create({
      data: {
        nome: data.nome,
        minutosAntes: data.minutosAntes,
        minutosDepois: data.minutosDepois,
        obrigatorio: data.obrigatorio,
        ativa: data.ativa,
        eventoId
      }
    })

    return mapRegra(regra)
  }

  async update(eventoId: string, id: string, userId: string, data: UpdateRegraRequest): Promise<RegraResponse> {
    // Check if evento exists
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId }
    })

    if (!evento || evento.creatorId !== userId) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    // Check if regra exists
    const regra = await prisma.regraEvento.findUnique({
      where: { id }
    })

    if (!regra || regra.eventoId !== eventoId) {
      throw { statusCode: 404, message: 'Regra not found' }
    }

    // If trying to disable, check if it's the only active rule
    if (data.ativa === false) {
      const outrasAtivas = await prisma.regraEvento.count({
        where: {
          eventoId,
          ativa: true,
          id: { not: id }
        }
      })

      if (outrasAtivas === 0) {
        throw { statusCode: 400, message: 'Cannot disable the only active rule for this event' }
      }
    }

    // If changing to mandatory and active, check for conflicts
    const novaRegra = {
      minutosAntes: data.minutosAntes ?? regra.minutosAntes,
      minutosDepois: data.minutosDepois ?? regra.minutosDepois
    }
    const novaObrigatorio = data.obrigatorio ?? regra.obrigatorio
    const novaAtiva = data.ativa ?? regra.ativa

    if (novaObrigatorio && novaAtiva && (!regra.obrigatorio || !regra.ativa)) {
      const outrasRegras = await prisma.regraEvento.findMany({
        where: {
          eventoId,
          obrigatorio: true,
          ativa: true,
          id: { not: id }
        }
      })

      for (const outra of outrasRegras) {
        if (temConflito(novaRegra, { minutosAntes: outra.minutosAntes, minutosDepois: outra.minutosDepois })) {
          throw {
            statusCode: 400,
            message: `Conflito detected com regra "${outra.nome}": interval [-${novaRegra.minutosAntes}, +${novaRegra.minutosDepois}] sobrepõe [-${outra.minutosAntes}, +${outra.minutosDepois}]`
          }
        }
      }
    }

    const updateData: any = {}
    if (data.nome) updateData.nome = data.nome
    if (data.minutosAntes !== undefined) updateData.minutosAntes = data.minutosAntes
    if (data.minutosDepois !== undefined) updateData.minutosDepois = data.minutosDepois
    if (data.obrigatorio !== undefined) updateData.obrigatorio = data.obrigatorio
    if (data.ativa !== undefined) updateData.ativa = data.ativa

    const updated = await prisma.regraEvento.update({
      where: { id },
      data: updateData
    })

    return mapRegra(updated)
  }

  async delete(eventoId: string, id: string, userId: string): Promise<void> {
    // Check if evento exists
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId }
    })

    if (!evento || evento.creatorId !== userId) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    // Check if regra exists
    const regra = await prisma.regraEvento.findUnique({
      where: { id }
    })

    if (!regra || regra.eventoId !== eventoId) {
      throw { statusCode: 404, message: 'Regra not found' }
    }

    // Check if it's the only active rule
    if (regra.ativa) {
      const outrasAtivas = await prisma.regraEvento.count({
        where: {
          eventoId,
          ativa: true,
          id: { not: id }
        }
      })

      if (outrasAtivas === 0) {
        throw { statusCode: 400, message: 'Cannot delete the only active rule for this event' }
      }
    }

    await prisma.regraEvento.delete({
      where: { id }
    })
  }
}

export default new RegrasCheckinService()
