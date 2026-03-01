interface ParticipanteResponse {
    id: string;
    nome: string;
    email: string;
}
interface InscricaoResponse {
    id: string;
    eventoId: string;
    participanteId: string;
    checkIn: boolean;
    dataInscricao: string;
}
declare class ParticipantesService {
    list(): Promise<ParticipanteResponse[]>;
    create(data: {
        nome: string;
        email: string;
    }): Promise<ParticipanteResponse>;
    update(id: string, data: {
        nome?: string;
        email?: string;
    }): Promise<ParticipanteResponse>;
    delete(id: string): Promise<void>;
    inscrever(participanteId: string, eventoId: string): Promise<InscricaoResponse>;
    transferir(participanteId: string, eventoOrigemId: string, eventoDestinoId: string): Promise<InscricaoResponse>;
    checkin(participanteId: string, eventoId: string, checkIn: boolean): Promise<InscricaoResponse>;
}
declare const _default: ParticipantesService;
export default _default;
