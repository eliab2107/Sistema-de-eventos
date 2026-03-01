interface RegraResponse {
    id: string;
    nome: string;
    minutosAntes: number;
    minutosDepois: number;
    obrigatorio: boolean;
    ativa: boolean;
    criadoEm: string;
    eventoId: string;
}
interface CreateRegraRequest {
    nome: string;
    minutosAntes: number;
    minutosDepois: number;
    obrigatorio: boolean;
    ativa: boolean;
}
interface UpdateRegraRequest {
    nome?: string;
    minutosAntes?: number;
    minutosDepois?: number;
    obrigatorio?: boolean;
    ativa?: boolean;
}
declare class RegrasCheckinService {
    list(eventoId: string): Promise<RegraResponse[]>;
    create(eventoId: string, data: CreateRegraRequest): Promise<RegraResponse>;
    update(eventoId: string, id: string, data: UpdateRegraRequest): Promise<RegraResponse>;
    delete(eventoId: string, id: string): Promise<void>;
}
declare const _default: RegrasCheckinService;
export default _default;
