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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const model_schema_1 = require("../models/schemas/model.schema");
const chat_conversation_schema_1 = require("./schemas/chat-conversation.schema");
let ChatService = class ChatService {
    constructor(modelStore, chatStore) {
        this.modelStore = modelStore;
        this.chatStore = chatStore;
    }
    async history(sessionId) {
        const conversation = await this.chatStore
            .findOne({ sessionId })
            .lean()
            .exec();
        return {
            sessionId,
            messages: conversation?.messages.map((message) => ({
                role: message.role,
                text: message.text,
                attachments: message.attachments ?? [],
                createdAt: message.createdAt
            })) ?? []
        };
    }
    async respond(payload) {
        const trimmedMessage = payload.message.trim();
        const selectedModel = payload.modelId
            ? await this.modelStore.findOne({ slug: payload.modelId }).lean().exec()
            : null;
        const attachmentSummary = payload.attachments && payload.attachments.length > 0
            ? ` I can also see ${payload.attachments.length} attachment${payload.attachments.length > 1 ? "s" : ""} (${payload.attachments.map((item) => item.kind).join(", ")}).`
            : "";
        const modelSummary = selectedModel
            ? `${selectedModel.name} by ${selectedModel.provider}`
            : "the current workspace model";
        const focus = this.inferFocus(trimmedMessage);
        const reply = `You're asking about "${trimmedMessage}" using ${modelSummary}.${attachmentSummary} ${focus}`;
        await this.appendMessages(payload.sessionId, [
            {
                role: "user",
                text: trimmedMessage,
                attachments: payload.attachments ?? [],
                createdAt: new Date()
            },
            {
                role: "assistant",
                text: reply,
                attachments: [],
                createdAt: new Date()
            }
        ]);
        return {
            reply,
            suggestedPrompts: [
                "Turn this into a step-by-step plan",
                "Summarize the best approach",
                "List risks and next actions"
            ]
        };
    }
    async saveMessage(payload) {
        await this.appendMessages(payload.sessionId, [
            {
                role: payload.role,
                text: payload.message.trim(),
                attachments: payload.attachments ?? [],
                createdAt: new Date()
            }
        ]);
        return {
            saved: true
        };
    }
    async appendMessages(sessionId, messages) {
        await this.chatStore
            .updateOne({ sessionId }, {
            $setOnInsert: { sessionId },
            $push: { messages: { $each: messages } }
        }, { upsert: true })
            .exec();
    }
    inferFocus(message) {
        const normalized = message.toLowerCase();
        if (normalized.includes("build") || normalized.includes("create")) {
            return "A good next step is to break this into requirements, implementation, and validation.";
        }
        if (normalized.includes("analy") || normalized.includes("review")) {
            return "I can help by extracting the key points, highlighting risks, and summarizing the findings.";
        }
        if (normalized.includes("code") || normalized.includes("api")) {
            return "I can respond with backend-friendly guidance, implementation steps, and API-level recommendations.";
        }
        return "I can help with a plan, a concise answer, or a more detailed breakdown depending on what you need next.";
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(model_schema_1.Model.name)),
    __param(1, (0, mongoose_1.InjectModel)(chat_conversation_schema_1.ChatConversation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map