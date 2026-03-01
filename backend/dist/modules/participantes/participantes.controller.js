"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const participantes_service_1 = __importDefault(require("./participantes.service"));
class ParticipantesController {
    async list(req, res) {
        try {
            const participantes = await participantes_service_1.default.list();
            res.json(participantes);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async create(req, res) {
        try {
            const { nome, email } = req.body;
            if (!nome || !email) {
                return res.status(400).json({ message: 'nome and email are required' });
            }
            const participante = await participantes_service_1.default.create({ nome, email });
            res.status(201).json(participante);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email } = req.body;
            const participante = await participantes_service_1.default.update(id, { nome, email });
            res.json(participante);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await participantes_service_1.default.delete(id);
            res.status(204).send();
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async inscrever(req, res) {
        try {
            const { id } = req.params;
            const { eventoId } = req.body;
            if (!eventoId) {
                return res.status(400).json({ message: 'eventoId is required' });
            }
            const inscricao = await participantes_service_1.default.inscrever(id, eventoId);
            res.status(201).json(inscricao);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async transferir(req, res) {
        try {
            const { id } = req.params;
            const { eventoOrigemId, eventoDestinoId } = req.body;
            if (!eventoOrigemId || !eventoDestinoId) {
                return res.status(400).json({ message: 'eventoOrigemId and eventoDestinoId are required' });
            }
            const inscricao = await participantes_service_1.default.transferir(id, eventoOrigemId, eventoDestinoId);
            res.json(inscricao);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async checkin(req, res) {
        try {
            const { id } = req.params;
            const { eventoId, checkIn } = req.body;
            if (!eventoId || checkIn === undefined) {
                return res.status(400).json({ message: 'eventoId and checkIn are required' });
            }
            const inscricao = await participantes_service_1.default.checkin(id, eventoId, checkIn);
            res.json(inscricao);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.default = new ParticipantesController();
//# sourceMappingURL=participantes.controller.js.map