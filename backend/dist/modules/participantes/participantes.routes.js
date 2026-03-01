"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const participantes_controller_1 = __importDefault(require("./participantes.controller"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => participantes_controller_1.default.list(req, res));
router.post('/', (req, res) => participantes_controller_1.default.create(req, res));
router.put('/:id', (req, res) => participantes_controller_1.default.update(req, res));
router.delete('/:id', (req, res) => participantes_controller_1.default.delete(req, res));
// Custom endpoints
router.post('/:id/inscrever', (req, res) => participantes_controller_1.default.inscrever(req, res));
router.put('/:id/transferir', (req, res) => participantes_controller_1.default.transferir(req, res));
router.put('/:id/checkin', (req, res) => participantes_controller_1.default.checkin(req, res));
exports.default = router;
//# sourceMappingURL=participantes.routes.js.map