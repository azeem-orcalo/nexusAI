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
exports.ModelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compare_models_dto_1 = require("./dto/compare-models.dto");
const list_models_query_dto_1 = require("./dto/list-models-query.dto");
const models_service_1 = require("./models.service");
let ModelsController = class ModelsController {
    constructor(modelsService) {
        this.modelsService = modelsService;
    }
    findAll(query) {
        return this.modelsService.findAll(query);
    }
    featured() {
        return this.modelsService.featured();
    }
    providers() {
        return this.modelsService.providers();
    }
    filters() {
        return this.modelsService.filters();
    }
    findOne(id) {
        return this.modelsService.findOne(id);
    }
    reviews(id) {
        return this.modelsService.reviews(id);
    }
    compare(payload) {
        return this.modelsService.compare(payload);
    }
};
exports.ModelsController = ModelsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List models with provider/category/search filters" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_models_query_dto_1.ListModelsQueryDto]),
    __metadata("design:returntype", void 0)
], ModelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("featured"),
    (0, swagger_1.ApiOperation)({ summary: "Get featured marketplace models" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModelsController.prototype, "featured", null);
__decorate([
    (0, common_1.Get)("providers"),
    (0, swagger_1.ApiOperation)({ summary: "List AI labs/providers" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModelsController.prototype, "providers", null);
__decorate([
    (0, common_1.Get)("filters"),
    (0, swagger_1.ApiOperation)({ summary: "Get marketplace filter metadata" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModelsController.prototype, "filters", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get full model details" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/reviews"),
    (0, swagger_1.ApiOperation)({ summary: "Get verified reviews for a model" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModelsController.prototype, "reviews", null);
__decorate([
    (0, common_1.Post)("compare"),
    (0, swagger_1.ApiOperation)({ summary: "Compare multiple models side by side" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compare_models_dto_1.CompareModelsDto]),
    __metadata("design:returntype", void 0)
], ModelsController.prototype, "compare", null);
exports.ModelsController = ModelsController = __decorate([
    (0, swagger_1.ApiTags)("models"),
    (0, common_1.Controller)("models"),
    __metadata("design:paramtypes", [models_service_1.ModelsService])
], ModelsController);
//# sourceMappingURL=models.controller.js.map