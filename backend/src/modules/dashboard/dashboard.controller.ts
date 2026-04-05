import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("overview")
  @ApiOperation({ summary: "Get dashboard overview metrics" })
  overview() {
    return this.dashboardService.overview();
  }

  @Get("usage")
  @ApiOperation({ summary: "Get usage chart data" })
  usage() {
    return this.dashboardService.usage();
  }

  @Get("agents/:id/performance")
  @ApiOperation({ summary: "Get agent performance metrics" })
  performance(@Param("id") id: string) {
    return this.dashboardService.performance(id);
  }
}
