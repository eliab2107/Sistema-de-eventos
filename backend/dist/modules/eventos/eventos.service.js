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
class EventosService {
    async list(filters) {
        const where = {};
        if (filters.nome) {
            where.nome = {
                contains: filters.nome
            };
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.local) {
            where.local = {
                contains: filters.local
            };
        }
        if (filters.dataInicial || filters.dataFinal) {
            where.data = {};
            if (filters.dataInicial) {
                where.data.gte = new Date(filters.dataInicial);
            }
            if (filters.dataFinal) {
                where.data.lte = new Date(filters.dataFinal);
            }
        }
        const eventos = await prisma_1.default.evento.findMany({ where });
        return eventos.map(mapEvento);
    }
    async getById(id) {
        const evento = await prisma_1.default.evento.findUnique({
            where: { id }
        });
        if (!evento) {
            throw { statusCode: 404, message: 'Evento not found' };
        }
        return mapEvento(evento);
    }
    async create(data) {
        // Validate status
        if (!['Ativo', 'Encerrado'].includes(data.status)) {
            throw { statusCode: 400, message: 'Status must be "Ativo" or "Encerrado"' };
        }
        // Validate date format
        const date = new Date(data.data);
        if (isNaN(date.getTime())) {
            throw { statusCode: 400, message: 'Invalid date format' };
        }
        const evento = await prisma_1.default.evento.create({
            data: {
                nome: data.nome,
                data: date,
                local: data.local,
                status: data.status
            }
        });
        return mapEvento(evento);
    }
    async update(id, data) {
        // Check if exists
        const existing = await prisma_1.default.evento.findUnique({
            where: { id }
        });
        if (!existing) {
            throw { statusCode: 404, message: 'Evento not found' };
        }
        // Validate status if provided
        if (data.status && !['Ativo', 'Encerrado'].includes(data.status)) {
            throw { statusCode: 400, message: 'Status must be "Ativo" or "Encerrado"' };
        }
        // Validate date if provided
        if (data.data) {
            const date = new Date(data.data);
            if (isNaN(date.getTime())) {
                throw { statusCode: 400, message: 'Invalid date format' };
            }
        }
        const updateData = {};
        if (data.nome)
            updateData.nome = data.nome;
        if (data.data)
            updateData.data = new Date(data.data);
        if (data.local)
            updateData.local = data.local;
        if (data.status)
            updateData.status = data.status;
        const evento = await prisma_1.default.evento.update({
            where: { id },
            data: updateData
        });
        return mapEvento(evento);
    }
    async delete(id) {
        // Check if exists
        const existing = await prisma_1.default.evento.findUnique({
            where: { id }
        });
        if (!existing) {
            throw { statusCode: 404, message: 'Evento not found' };
        }
        await prisma_1.default.evento.delete({
            where: { id }
        });
    }
    async getCompleto(id) {
        // Get evento with inscriptions and regras
        const evento = await prisma_1.default.evento.findUnique({
            where: { id },
            include: {
                inscricoes: {
                    include: {
                        participante: true
                    }
                },
                regras: true
            }
        });
        if (!evento) {
            throw { statusCode: 404, message: 'Evento not found' };
        }
        // Map participantes
        const participantes = evento.inscricoes.map((inscricao) => ({
            id: inscricao.participante.id,
            nome: inscricao.participante.nome,
            email: inscricao.participante.email,
            checkIn: inscricao.checkIn,
            dataInscricao: inscricao.dataInscricao.toISOString()
        }));
        // Map regras
        const regras = evento.regras.map((regra) => ({
            id: regra.id,
            nome: regra.nome,
            minutosAntes: regra.minutosAntes,
            minutosDepois: regra.minutosDepois,
            obrigatorio: regra.obrigatorio,
            ativa: regra.ativa,
            criadoEm: regra.criadoEm.toISOString()
        }));
        return {
            evento: mapEvento(evento),
            participantes,
            regras
        };
    }
}
exports.default = new EventosService();
//# sourceMappingURL=eventos.service.js.map