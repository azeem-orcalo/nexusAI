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
exports.ChatConversationSchema = exports.ChatConversation = exports.ChatConversationMessage = exports.ChatConversationAttachment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ChatConversationAttachment = class ChatConversationAttachment {
};
exports.ChatConversationAttachment = ChatConversationAttachment;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatConversationAttachment.prototype, "kind", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatConversationAttachment.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ChatConversationAttachment.prototype, "sizeLabel", void 0);
exports.ChatConversationAttachment = ChatConversationAttachment = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ChatConversationAttachment);
const ChatConversationAttachmentSchema = mongoose_1.SchemaFactory.createForClass(ChatConversationAttachment);
let ChatConversationMessage = class ChatConversationMessage {
};
exports.ChatConversationMessage = ChatConversationMessage;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["assistant", "user"] }),
    __metadata("design:type", String)
], ChatConversationMessage.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatConversationMessage.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ChatConversationAttachmentSchema], default: [] }),
    __metadata("design:type", Array)
], ChatConversationMessage.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ChatConversationMessage.prototype, "createdAt", void 0);
exports.ChatConversationMessage = ChatConversationMessage = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ChatConversationMessage);
const ChatConversationMessageSchema = mongoose_1.SchemaFactory.createForClass(ChatConversationMessage);
let ChatConversation = class ChatConversation {
};
exports.ChatConversation = ChatConversation;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], ChatConversation.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ChatConversationMessageSchema], default: [] }),
    __metadata("design:type", Array)
], ChatConversation.prototype, "messages", void 0);
exports.ChatConversation = ChatConversation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: "chat_conversations" })
], ChatConversation);
exports.ChatConversationSchema = mongoose_1.SchemaFactory.createForClass(ChatConversation);
//# sourceMappingURL=chat-conversation.schema.js.map