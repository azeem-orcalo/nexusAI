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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentTaskSchema = exports.AgentTask = exports.AgentTaskMessageSchema = exports.AgentTaskMessageSchemaClass = exports.AgentTaskMessage = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
class AgentTaskMessage {
}
exports.AgentTaskMessage = AgentTaskMessage;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true, enum: ["assistant", "user"] }),
    __metadata("design:type", String)
], AgentTaskMessage.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AgentTaskMessage.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], AgentTaskMessage.prototype, "createdAt", void 0);
let AgentTaskMessageSchemaClass = class AgentTaskMessageSchemaClass extends AgentTaskMessage {
};
exports.AgentTaskMessageSchemaClass = AgentTaskMessageSchemaClass;
exports.AgentTaskMessageSchemaClass = AgentTaskMessageSchemaClass = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], AgentTaskMessageSchemaClass);
exports.AgentTaskMessageSchema = mongoose_1.SchemaFactory.createForClass(AgentTaskMessageSchemaClass);
let AgentTask = class AgentTask {
};
exports.AgentTask = AgentTask;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AgentTask.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AgentTask.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], AgentTask.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AgentTaskMessage] }),
    (0, mongoose_1.Prop)({ type: [exports.AgentTaskMessageSchema], default: [] }),
    __metadata("design:type", Array)
], AgentTask.prototype, "messages", void 0);
exports.AgentTask = AgentTask = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: "agent_tasks" })
], AgentTask);
exports.AgentTaskSchema = mongoose_1.SchemaFactory.createForClass(AgentTask);
//# sourceMappingURL=agent-task.schema.js.map