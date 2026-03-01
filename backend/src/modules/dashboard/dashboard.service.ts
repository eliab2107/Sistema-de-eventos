import prisma from '../../prisma'

interface EventoResponse {
  id: string
  nome: string
  data: string
  local: string
  status: string
}

interface InscricaoResponse {
  id: string
  eventoId: string
  participanteId: string
  checkIn: boolean
  dataInscricao: string
}

interface DashboardResponse {
  totalEventos: number
  totalParticipantes: number
  proximosEventos: EventoResponse[]
  ultimosCheckins: InscricaoResponse[]
}

function mapEvento(evento: any): EventoResponse {
  return {
    id: evento.id,
    nome: evento.nome,
    data: evento.data.toISOString(),
    local: evento.local,
    status: evento.status
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

class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    const [
      totalEventos,
      totalParticipantes,
      proximosEventos,
      ultimosCheckins
    ] = await Promise.all([
      prisma.evento.count(),
      prisma.participante.count(),
      prisma.evento.findMany({
        where: {
          data: {
            gte: new Date()
          }
        },
        orderBy: { data: 'asc' },
        take: 5
      }),
      prisma.inscricao.findMany({
        orderBy: { dataInscricao: 'desc' },
        take: 5
      })
    ])

    return {
      totalEventos,
      totalParticipantes,
      proximosEventos: proximosEventos.map(mapEvento),
      ultimosCheckins: ultimosCheckins.map(mapInscricao)
    }
  }
}

export default new DashboardService()
