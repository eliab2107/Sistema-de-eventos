"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_service_1 = __importDefault(require("./dashboard.service"));
class DashboardController {
    async get(req, res) {
        try {
            const data = await dashboard_service_1.default.getDashboard();
            res.json(data);
        }
        catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.default = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map