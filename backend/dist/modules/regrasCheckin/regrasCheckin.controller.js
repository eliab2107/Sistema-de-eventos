"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const regrasCheckin_service_1 = __importDefault(require("./regrasCheckin.service"));
class RegrasCheckinController {
    async list(req, res) {
        try {
            const { eventoId } = req.params;
            const regras = await regrasCheckin_service_1.default.list(eventoId);
            res.json(regras);
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
            const { eventoId } = req.params;
            const { nome, minutosAntes, minutosDepois, obrigatorio, ativa } = req.body;
            if (!nome || minutosAntes === undefined || minutosDepois === undefined) {
                return res.status(400).json({ message: 'nome, minutosAntes and minutosDepois are required' });
            }
            const regra = await regrasCheckin_service_1.default.create(eventoId, {
                nome,
                minutosAntes,
                minutosDepois,
                obrigatorio: obrigatorio ?? true,
                ativa: ativa ?? true
            });
            res.status(201).json(regra);
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
            const { eventoId, id } = req.params;
            const { nome, minutosAntes, minutosDepois, obrigatorio, ativa } = req.body;
            const regra = await regrasCheckin_service_1.default.update(eventoId, id, {
                nome,
                minutosAntes,
                minutosDepois,
                obrigatorio,
                ativa
            });
            res.json(regra);
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
            const { eventoId, id } = req.params;
            await regrasCheckin_service_1.default.delete(eventoId, id);
            res.status(204).send();
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.default = new RegrasCheckinController();
//# sourceMappingURL=regrasCheckin.controller.js.map