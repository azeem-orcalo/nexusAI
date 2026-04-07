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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_message_dto_1 = require("./dto/chat-message.dto");
const chat_service_1 = require("./chat.service");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    history(sessionId) {
        return this.chatService.history(sessionId);
    }
    deleteHistory(sessionId) {
        return this.chatService.deleteHistory(sessionId);
    }
    respond(payload) {
        return this.chatService.respond(payload);
    }
    saveMessage(payload) {
        return this.chatService.saveMessage(payload);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)("history"),
    (0, swagger_1.ApiOperation)({ summary: "Get chat history for a saved conversation" }),
    __param(0, (0, common_1.Query)("sessionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "history", null);
__decorate([
    (0, common_1.Delete)("history"),
    (0, swagger_1.ApiOperation)({ summary: "Delete chat history for a saved conversation" }),
    __param(0, (0, common_1.Query)("sessionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "deleteHistory", null);
__decorate([
    (0, common_1.Post)("respond"),
    (0, swagger_1.ApiOperation)({ summary: "Get a chat response for the chat hub composer" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_message_dto_1.ChatMessageDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "respond", null);
__decorate([
    (0, common_1.Post)("messages"),
    (0, swagger_1.ApiOperation)({ summary: "Save a chat message without generating a response" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_message_dto_1.SaveChatMessageDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "saveMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)("chat"),
    (0, common_1.Controller)("chat"),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map