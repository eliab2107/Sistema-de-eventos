"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const login = async (req, res) => {
    const { email, password } = req.body;
    // 1. Buscar usuário
    const user = await client_1.default.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    // 2. Validar senha
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    // 3. Gerar Token
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret_fallback', { expiresIn: '1d' });
    return res.json({
        user: { id: user.id, email: user.email },
        token
    });
};
exports.login = login;
//# sourceMappingURL=AuthController.js.map