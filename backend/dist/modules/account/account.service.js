"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
let AccountService = class AccountService {
    getSettings() {
        return {
            language: "en",
            persona: "builder"
        };
    }
    updateSettings(payload) {
        return {
            language: payload.language ?? "en",
            persona: payload.persona ?? "builder"
        };
    }
    getApiKeys() {
        return [
            {
                id: "key_001",
                label: "Local dev key",
                keyPreview: "sk_live_****93JH",
                isActive: true
            }
        ];
    }
    createApiKey(payload) {
        return {
            id: "key_002",
            label: payload.label,
            keyPreview: "sk_live_****N8KL",
            isActive: true
        };
    }
    removeApiKey(id) {
        return {
            deleted: true,
            id
        };
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)()
], AccountService);
//# sourceMappingURL=account.service.js.map