"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma"));
function mapParticipante(participante) {
    return {
        id: participante.id,
        nome: participante.nome,
        email: participante.email
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
class ParticipantesService {
    async list() {
        const participantes = await prisma_1.default.participante.findMany();
        return participantes.map(mapParticipante);
    }
    async create(data) {
        // Check if email already exists
        const existing = await prisma_1.default.participante.findUnique({
            where: { email: data.email }
        });
        if (existing) {
            throw { statusCode: 400, message: 'Email already registered' };
        }
        const participante = await prisma_1.default.participante.create({
            data: {
                nome: data.nome,
                email: data.email
            }
        });
        return mapParticipante(participante);
    }
    async update(id, data) {
        // Check if exists
        const existing = await prisma_1.default.participante.findUnique({
            where: { id }
        });
        if (!existing) {
            throw { statusCode: 404, message: 'Participante not found' };
        }
        // Check if new email is not already taken
        if (data.email && data.email !== existing.email) {
            const emailTaken = await prisma_1.default.participante.findUnique({
                where: { email: data.email }
            });
            if (emailTaken) {
                throw { statusCode: 400, message: 'Email already registered' };
            }
        }
        const updateData = {};
        if (data.nome)
            updateData.nome = data.nome;
        if (data.email)
            updateData.email = data.email;
        const participante = await prisma_1.default.participante.update({
            where: { id },
            data: updateData
        });
        return mapParticipante(participante);
    }
    async delete(id) {
        // Check if exists
        const existing = await prisma_1.default.participante.findUnique({
            where: { id }
        });
        if (!existing) {
            throw { statusCode: 404, message: 'Participante not found' };
        }
        await prisma_1.default.participante.delete({
            where: { id }
        });
    }
    async inscrever(participanteId, eventoId) {
        // Check if participante exists
        const participante = await prisma_1.default.participante.findUnique({
            where: { id: participanteId }
        });
        if (!participante) {
            throw { statusCode: 404, message: 'Participante not found' };
        }
        // Check if evento exists
        const evento = await prisma_1.default.evento.findUnique({
            where: { id: eventoId }
        });
        if (!evento) {
            throw { statusCode: 404, message: 'Evento not found' };
        }
        // Check if already inscribed
        const existing = await prisma_1.default.inscricao.findUnique({
            where: {
                eventoId_participanteId: {
                    eventoId,
                    participanteId
                }
            }
        });
        if (existing) {
            throw { statusCode: 400, message: 'Participante already inscribed in this event' };
        }
        const inscricao = await prisma_1.default.inscricao.create({
            data: {
                eventoId,
                participanteId
            }
        });
        return mapInscricao(inscricao);
    }
    async transferir(participanteId, eventoOrigemId, eventoDestinoId) {
        // Check if participante exists
        const participante = await prisma_1.default.participante.findUnique({
            where: { id: participanteId }
        });
        if (!participante) {
            throw { statusCode: 404, message: 'Participante not found' };
        }
        // Check if origem evento exists
        const eventoOrigem = await prisma_1.default.evento.findUnique({
            where: { id: eventoOrigemId }
        });
        if (!eventoOrigem) {
            throw { statusCode: 404, message: 'Origem evento not found' };
        }
        // Check if destino evento exists
        const eventoDestino = await prisma_1.default.evento.findUnique({
            where: { id: eventoDestinoId }
        });
        if (!eventoDestino) {
            throw { statusCode: 404, message: 'Destino evento not found' };
        }
        // Check if inscribed in origem
        const inscricaoOrigem = await prisma_1.default.inscricao.findUnique({
            where: {
                eventoId_participanteId: {
                    eventoId: eventoOrigemId,
                    participanteId
                }
            }
        });
        if (!inscricaoOrigem) {
            throw { statusCode: 400, message: 'Participante is not inscribed in origem evento' };
        }
        // Check if already inscribed in destino
        const inscricaoDestino = await prisma_1.default.inscricao.findUnique({
            where: {
                eventoId_participanteId: {
                    eventoId: eventoDestinoId,
                    participanteId
                }
            }
        });
        if (inscricaoDestino) {
            throw { statusCode: 400, message: 'Participante is already inscribed in destino evento' };
        }
        // Delete from origem and create in destino
        await prisma_1.default.inscricao.delete({
            where: { id: inscricaoOrigem.id }
        });
        const novaInscricao = await prisma_1.default.inscricao.create({
            data: {
                eventoId: eventoDestinoId,
                participanteId
            }
        });
        return mapInscricao(novaInscricao);
    }
    async checkin(participanteId, eventoId, checkIn) {
        // Check if inscricao exists
        const inscricao = await prisma_1.default.inscricao.findUnique({
            where: {
                eventoId_participanteId: {
                    eventoId,
                    participanteId
                }
            }
        });
        if (!inscricao) {
            throw { statusCode: 404, message: 'Inscricao not found' };
        }
        const updated = await prisma_1.default.inscricao.update({
            where: { id: inscricao.id },
            data: { checkIn }
        });
        return mapInscricao(updated);
    }
}
exports.default = new ParticipantesService();
//# sourceMappingURL=participantes.service.js.map