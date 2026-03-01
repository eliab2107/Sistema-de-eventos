"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma"));
function mapEvento(evento) {
    return {
        id: evento.id,
        nome: evento.nome,
        data: evento.data.toISOString(),
        local: evento.local,
        status: evento.status
    };
}
function mapInscricao(inscricao) {
    return {
        id: inscricao.id,
        eventoId: inscricao.eventoId,
        participanteId: inscricao.participanteId,
        checkIn: inscricao.checkIn,
        dataInscricao: inscricao.dataInscricao.toISOString()
    };
}
class DashboardService {
    async getDashboard() {
        const [totalEventos, totalParticipantes, proximosEventos, ultimosCheckins] = await Promise.all([
            prisma_1.default.evento.count(),
            prisma_1.default.participante.count(),
            prisma_1.default.evento.findMany({
                where: {
                    data: {
                        gte: new Date()
                    }
                },
                orderBy: { data: 'asc' },
                take: 5
            }),
            prisma_1.default.inscricao.findMany({
                orderBy: { dataInscricao: 'desc' },
                take: 5
            })
        ]);
        return {
            totalEventos,
            totalParticipantes,
            proximosEventos: proximosEventos.map(mapEvento),
            ultimosCheckins: ultimosCheckins.map(mapInscricao)
        };
    }
}
exports.default = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map