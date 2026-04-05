"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const account_module_1 = require("./modules/account/account.module");
const agents_module_1 = require("./modules/agents/agents.module");
const auth_module_1 = require("./modules/auth/auth.module");
const database_config_1 = require("./database.config");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const discover_module_1 = require("./modules/discover/discover.module");
const models_module_1 = require("./modules/models/models.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ...database_config_1.databaseImports,
            auth_module_1.AuthModule,
            models_module_1.ModelsModule,
            agents_module_1.AgentsModule,
            dashboard_module_1.DashboardModule,
            discover_module_1.DiscoverModule,
            account_module_1.AccountModule
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map