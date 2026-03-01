"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const eventos_routes_1 = __importDefault(require("./modules/eventos/eventos.routes"));
const participantes_routes_1 = __importDefault(require("./modules/participantes/participantes.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const regrasCheckin_routes_1 = __importDefault(require("./modules/regrasCheckin/regrasCheckin.routes"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Public routes
app.use('/auth', auth_routes_1.default);
// Protected routes
//app.use(authMiddleware)
app.use('/eventos', auth_middleware_1.default, eventos_routes_1.default);
app.use('/participantes', auth_middleware_1.default, participantes_routes_1.default);
app.use('/dashboard', auth_middleware_1.default, dashboard_routes_1.default);
app.use('/eventos', auth_middleware_1.default, regrasCheckin_routes_1.default);
// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal server error' });
});
exports.default = app;
//# sourceMappingURL=app.js.map