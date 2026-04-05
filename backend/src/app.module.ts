import { Module } from "@nestjs/common";
import { AccountModule } from "./modules/account/account.module";
import { AgentsModule } from "./modules/agents/agents.module";
import { AuthModule } from "./modules/auth/auth.module";
import { databaseImports } from "./database.config";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DiscoverModule } from "./modules/discover/discover.module";
import { ModelsModule } from "./modules/models/models.module";

@Module({
  imports: [
    ...databaseImports,
    AuthModule,
    ModelsModule,
    AgentsModule,
    DashboardModule,
    DiscoverModule,
    AccountModule
  ]
})
export class AppModule {}
