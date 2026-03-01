"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventos_service_1 = __importDefault(require("./eventos.service"));
class EventosController {
    async list(req, res) {
        try {
            const filters = req.query;
            const eventos = await eventos_service_1.default.list(filters);
            res.json(eventos);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const evento = await eventos_service_1.default.getById(id);
            res.json(evento);
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
            const { nome, data, local, status } = req.body;
            if (!nome || !data || !local || !status) {
                return res.status(400).json({ message: 'nome, data, local and status are required' });
            }
            const evento = await eventos_service_1.default.create({ nome, data, local, status });
            res.status(201).json(evento);
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
            const { nome, data, local, status } = req.body;
            const evento = await eventos_service_1.default.update(id, { nome, data, local, status });
            res.json(evento);
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
            await eventos_service_1.default.delete(id);
            res.status(204).send();
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getCompleto(req, res) {
        try {
            const { id } = req.params;
            const eventoCompleto = await eventos_service_1.default.getCompleto(id);
            res.json(eventoCompleto);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.default = new EventosController();
//# sourceMappingURL=eventos.controller.js.map