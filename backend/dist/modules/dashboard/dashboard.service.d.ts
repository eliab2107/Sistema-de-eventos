interface EventoResponse {
    id: string;
    nome: string;
    data: string;
    local: string;
    status: string;
}
interface InscricaoResponse {
    id: string;
    eventoId: string;
    participanteId: string;
    checkIn: boolean;
    dataInscricao: string;
}
interface DashboardResponse {
    totalEventos: number;
    totalParticipantes: number;
    proximosEventos: EventoResponse[];
    ultimosCheckins: InscricaoResponse[];
}
declare class DashboardService {
    getDashboard(): Promise<DashboardResponse>;
}
declare const _default: DashboardService;
export default _default;
