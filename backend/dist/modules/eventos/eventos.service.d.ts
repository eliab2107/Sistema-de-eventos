interface CreateEventoRequest {
    nome: string;
    data: string;
    local: string;
    status: string;
}
interface UpdateEventoRequest {
    nome?: string;
    data?: string;
    local?: string;
    status?: string;
}
interface ListFilters {
    nome?: string;
    status?: string;
    local?: string;
    dataInicial?: string;
    dataFinal?: string;
}
interface EventoResponse {
    id: string;
    nome: string;
    data: string;
    local: string;
    status: string;
}
interface ParticipanteInscrito {
    id: string;
    nome: string;
    email: string;
    checkIn: boolean;
    dataInscricao: string;
}
interface RegraCheckin {
    id: string;
    nome: string;
    minutosAntes: number;
    minutosDepois: number;
    obrigatorio: boolean;
    ativa: boolean;
    criadoEm: string;
}
interface EventoCompleto {
    evento: EventoResponse;
    participantes: ParticipanteInscrito[];
    regras: RegraCheckin[];
}
declare class EventosService {
    list(filters: ListFilters): Promise<EventoResponse[]>;
    getById(id: string): Promise<EventoResponse>;
    create(data: CreateEventoRequest): Promise<EventoResponse>;
    update(id: string, data: UpdateEventoRequest): Promise<EventoResponse>;
    delete(id: string): Promise<void>;
    getCompleto(id: string): Promise<EventoCompleto>;
}
declare const _default: EventosService;
export default _default;
