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
exports.DiscoverController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const recommendation_request_dto_1 = require("./dto/recommendation-request.dto");
const discover_service_1 = require("./discover.service");
let DiscoverController = class DiscoverController {
    constructor(discoverService) {
        this.discoverService = discoverService;
    }
    onboarding() {
        return this.discoverService.onboarding();
    }
    recommend(payload) {
        return this.discoverService.recommend(payload);
    }
    quickActions() {
        return this.discoverService.quickActions();
    }
    researchFeed() {
        return this.discoverService.researchFeed();
    }
};
exports.DiscoverController = DiscoverController;
__decorate([
    (0, common_1.Get)("onboarding"),
    (0, swagger_1.ApiOperation)({ summary: "Get onboarding questionnaire metadata" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscoverController.prototype, "onboarding", null);
__decorate([
    (0, common_1.Post)("recommendations"),
    (0, swagger_1.ApiOperation)({ summary: "Get guided model recommendations" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recommendation_request_dto_1.RecommendationRequestDto]),
    __metadata("design:returntype", void 0)
], DiscoverController.prototype, "recommend", null);
__decorate([
    (0, common_1.Get)("quick-actions"),
    (0, swagger_1.ApiOperation)({ summary: "Get chat hub quick actions" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscoverController.prototype, "quickActions", null);
__decorate([
    (0, common_1.Get)("research-feed"),
    (0, swagger_1.ApiOperation)({ summary: "Get research and release feed items" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscoverController.prototype, "researchFeed", null);
exports.DiscoverController = DiscoverController = __decorate([
    (0, swagger_1.ApiTags)("discover"),
    (0, common_1.Controller)("discover"),
    __metadata("design:paramtypes", [discover_service_1.DiscoverService])
], DiscoverController);
//# sourceMappingURL=discover.controller.js.map