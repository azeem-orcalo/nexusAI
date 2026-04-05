export declare class DashboardService {
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
    performance(agentId: string): {
        agentId: string;
        satisfactionScore: number;
        successRate: number;
        latencyMs: number;
    };
}
