import prisma from '../../prisma'

interface CreateEventoRequest {
  nome: string
  data: string
  local: string
  status: string
}

interface UpdateEventoRequest {
  nome?: string
  data?: string
  local?: string
  status?: string
}

interface ListFilters {
  nome?: string
  status?: string
  local?: string
  dataInicial?: string
  dataFinal?: string
}

interface EventoResponse {
  id: string
  nome: string
  data: string
  local: string
  status: string
}

interface ParticipanteInscrito {
  id: string
  nome: string
  email: string
  checkIn: boolean
  dataInscricao: string
}

interface RegraCheckin {
  id: string
  nome: string
  minutosAntes: number
  minutosDepois: number
  obrigatorio: boolean
  ativa: boolean
  criadoEm: string
}

interface EventoCompleto {
  evento: EventoResponse
  participantes: ParticipanteInscrito[]
  regras: RegraCheckin[]
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

class EventosService {
  async list(filters: ListFilters): Promise<EventoResponse[]> {
    const where: any = {}

    if (filters.nome) {
      where.nome = {
        contains: filters.nome
      }
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.local) {
      where.local = {
        contains: filters.local
      }
    }

    if (filters.dataInicial || filters.dataFinal) {
      where.data = {}
      if (filters.dataInicial) {
        where.data.gte = new Date(filters.dataInicial)
      }
      if (filters.dataFinal) {
        where.data.lte = new Date(filters.dataFinal)
      }
    }

    const eventos = await prisma.evento.findMany({ where })
    return eventos.map(mapEvento)
  }

  async getById(id: string): Promise<EventoResponse> {
    const evento = await prisma.evento.findUnique({
      where: { id }
    })

    if (!evento) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    return mapEvento(evento)
  }

  async create(data: CreateEventoRequest): Promise<EventoResponse> {
    // Validate status
    if (!['Ativo', 'Encerrado'].includes(data.status)) {
      throw { statusCode: 400, message: 'Status must be "Ativo" or "Encerrado"' }
    }

    // Validate date format
    const date = new Date(data.data)
    if (isNaN(date.getTime())) {
      throw { statusCode: 400, message: 'Invalid date format' }
    }

    const evento = await prisma.evento.create({
      data: {
        nome: data.nome,
        data: date,
        local: data.local,
        status: data.status
      }
    })

    return mapEvento(evento)
  }

  async update(id: string, data: UpdateEventoRequest): Promise<EventoResponse> {
    
    const existing = await prisma.evento.findUnique({
      where: { id }
    })

    if (!existing) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    // Validate status if provided
    if (data.status && !['Ativo', 'Encerrado'].includes(data.status)) {
      throw { statusCode: 400, message: 'Status must be "Ativo" or "Encerrado"' }
    }

    // Validate date if provided
    if (data.data) {
      const date = new Date(data.data)
      if (isNaN(date.getTime())) {
        throw { statusCode: 400, message: 'Invalid date format' }
      }
    }

    const updateData: any = {}
    if (data.nome) updateData.nome = data.nome
    if (data.data) updateData.data = new Date(data.data)
    if (data.local) updateData.local = data.local
    if (data.status) updateData.status = data.status

    const evento = await prisma.evento.update({
      where: { id },
      data: updateData
    })

    return mapEvento(evento)
  }

  async delete(id: string): Promise<void> {
    
    const existing = await prisma.evento.findUnique({
      where: { id }
    })

    if (!existing) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    await prisma.evento.delete({
      where: { id }
    })
  }

  async getCompleto(id: string): Promise<EventoCompleto> {
    
    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        inscricoes: {
          include: {
            participante: true
          }
        },
        regras: true
      }
    })

    if (!evento) {
      throw { statusCode: 404, message: 'Evento not found' }
    }

    
    const participantes: ParticipanteInscrito[] = evento.inscricoes.map((inscricao: { participante: { id: any; nome: any; email: any }; checkIn: any; dataInscricao: { toISOString: () => any } }) => ({
      id: inscricao.participante.id,
      nome: inscricao.participante.nome,
      email: inscricao.participante.email,
      checkIn: inscricao.checkIn,
      dataInscricao: inscricao.dataInscricao.toISOString()
    }))

   
    const regras: RegraCheckin[] = evento.regras.map((regra: { id: any; nome: any; minutosAntes: any; minutosDepois: any; obrigatorio: any; ativa: any; criadoEm: { toISOString: () => any } }) => ({
      id: regra.id,
      nome: regra.nome,
      minutosAntes: regra.minutosAntes,
      minutosDepois: regra.minutosDepois,
      obrigatorio: regra.obrigatorio,
      ativa: regra.ativa,
      criadoEm: regra.criadoEm.toISOString()
    }))

    return {
      evento: mapEvento(evento),
      participantes,
      regras
    }
  }
}

export default new EventosService()
