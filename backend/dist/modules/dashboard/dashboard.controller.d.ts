import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    overview(): {
        requests: number;
        costUsd: number;
        averageLatencyMs: number;
        activeModels: number;
    };
    usage(): {
        day: string;
        requests: number;
        costUsd: number;
    }[];
    performance(id: string): {
        agentId: string;
        satisfactionScore: number;
        successRate: number;
        latencyMs: number;
    };
}
