"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverService = void 0;
const common_1 = require("@nestjs/common");
let DiscoverService = class DiscoverService {
    onboarding() {
        return {
            steps: [
                "Select your goal",
                "Choose a budget or use case",
                "Review recommended models"
            ]
        };
    }
    recommend(payload) {
        return {
            goal: payload.goal,
            recommendations: [
                { modelId: "gpt-5", reason: "Best for complex agent reasoning" },
                { modelId: "gpt-4o", reason: "Strong multimodal balance" }
            ]
        };
    }
    quickActions() {
        return [
            "Create image",
            "Generate audio",
            "Create slides",
            "Analyze data",
            "Code generation"
        ];
    }
    researchFeed() {
        return [
            {
                id: "res_001",
                title: "GPT-5.2 released",
                summary: "Improved multimodal instruction following",
                provider: "OpenAI"
            }
        ];
    }
};
exports.DiscoverService = DiscoverService;
exports.DiscoverService = DiscoverService = __decorate([
    (0, common_1.Injectable)()
], DiscoverService);
//# sourceMappingURL=discover.service.js.map