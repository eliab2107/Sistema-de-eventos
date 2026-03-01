"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const regrasCheckin_controller_1 = __importDefault(require("./regrasCheckin.controller"));
const router = (0, express_1.Router)();
// GET /eventos/:eventoId/regras-checkin
router.get('/:eventoId/regras-checkin', (req, res) => regrasCheckin_controller_1.default.list(req, res));
// POST /eventos/:eventoId/regras-checkin
router.post('/:eventoId/regras-checkin', (req, res) => regrasCheckin_controller_1.default.create(req, res));
// PUT /eventos/:eventoId/regras-checkin/:id
router.put('/:eventoId/regras-checkin/:id', (req, res) => regrasCheckin_controller_1.default.update(req, res));
// DELETE /eventos/:eventoId/regras-checkin/:id
router.delete('/:eventoId/regras-checkin/:id', (req, res) => regrasCheckin_controller_1.default.delete(req, res));
exports.default = router;
//# sourceMappingURL=regrasCheckin.routes.js.map