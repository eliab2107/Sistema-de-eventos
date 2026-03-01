"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventos_controller_1 = __importDefault(require("./eventos.controller"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => eventos_controller_1.default.list(req, res));
router.get('/:id/completo', (req, res) => eventos_controller_1.default.getCompleto(req, res));
router.get('/:id', (req, res) => eventos_controller_1.default.getById(req, res));
router.post('/', (req, res) => eventos_controller_1.default.create(req, res));
router.put('/:id', (req, res) => eventos_controller_1.default.update(req, res));
router.delete('/:id', (req, res) => eventos_controller_1.default.delete(req, res));
exports.default = router;
//# sourceMappingURL=eventos.routes.js.map