"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const AuthController_1 = require("./Controllers/AuthController");
const AuthMiddleware_1 = require("./middlewares/AuthMiddleware");
const routes = (0, express_1.Router)();
exports.routes = routes;
// Rota pública
routes.post('/login', AuthController_1.login);
// Rotas protegidas
routes.use(AuthMiddleware_1.authMiddleware); // Tudo abaixo daqui exige token
routes.get('/dashboard', (req, res) => res.json({ message: 'Acesso liberado!' }));
//# sourceMappingURL=Routes.js.map