import { Injectable } from "@nestjs/common";

@Injectable()
export class DashboardService {
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

  performance(agentId: string) {
    return {
      agentId,
      satisfactionScore: 4.8,
      successRate: 0.94,
      latencyMs: 1030
    };
  }
}
