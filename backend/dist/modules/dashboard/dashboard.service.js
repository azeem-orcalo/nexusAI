"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
let DashboardService = class DashboardService {
    overview() {
        return {
            requests: 128432,
            costUsd: 1824.4,
            averageLatencyMs: 980,
            activeModels: 12
        };
    }
    usage() {
        return [
            { day: "Mon", requests: 18200, costUsd: 220.3 },
            { day: "Tue", requests: 19420, costUsd: 248.1 }
        ];
    }
    performance(agentId) {
        return {
            agentId,
            satisfactionScore: 4.8,
            successRate: 0.94,
            latencyMs: 1030
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)()
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map