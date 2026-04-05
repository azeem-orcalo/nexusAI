"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const account_service_1 = require("./account.service");
const create_api_key_dto_1 = require("./dto/create-api-key.dto");
const update_settings_dto_1 = require("./dto/update-settings.dto");
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    settings() {
        return this.accountService.getSettings();
    }
    updateSettings(payload) {
        return this.accountService.updateSettings(payload);
    }
    apiKeys() {
        return this.accountService.getApiKeys();
    }
    createApiKey(payload) {
        return this.accountService.createApiKey(payload);
    }
    removeApiKey(id) {
        return this.accountService.removeApiKey(id);
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.Get)("settings"),
    (0, swagger_1.ApiOperation)({ summary: "Get account and personalization settings" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "settings", null);
__decorate([
    (0, common_1.Patch)("settings"),
    (0, swagger_1.ApiOperation)({ summary: "Update language and personalization settings" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_settings_dto_1.UpdateSettingsDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)("api-keys"),
    (0, swagger_1.ApiOperation)({ summary: "List API keys" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "apiKeys", null);
__decorate([
    (0, common_1.Post)("api-keys"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new API key" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_api_key_dto_1.CreateApiKeyDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "createApiKey", null);
__decorate([
    (0, common_1.Delete)("api-keys/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete an API key" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "removeApiKey", null);
exports.AccountController = AccountController = __decorate([
    (0, swagger_1.ApiTags)("account"),
    (0, common_1.Controller)("account"),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
//# sourceMappingURL=account.controller.js.map