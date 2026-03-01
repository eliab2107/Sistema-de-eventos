"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../prisma"));
class AuthService {
    async login(email, password) {
        // Find user
        const user = await prisma_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }
        // Compare password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }
        // Generate token
        const secret = process.env.JWT_SECRET || 'secret';
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });
        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map