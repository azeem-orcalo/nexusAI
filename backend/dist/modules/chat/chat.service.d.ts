import { Model as MongooseModel } from "mongoose";
import { ChatMessageDto, SaveChatMessageDto } from "./dto/chat-message.dto";
import { ModelDocument } from "../models/schemas/model.schema";
import { ChatConversationDocument } from "./schemas/chat-conversation.schema";
export declare class ChatService {
    private readonly modelStore;
    private readonly chatStore;
    constructor(modelStore: MongooseModel<ModelDocument>, chatStore: MongooseModel<ChatConversationDocument>);
    history(sessionId: string): Promise<{
        sessionId: string;
        messages: {
            role: "user" | "assistant";
            text: string;
            attachments: import("mongoose").FlattenMaps<import("./schemas/chat-conversation.schema").ChatConversationAttachment>[];
            createdAt: Date;
        }[];
    }>;
    respond(payload: ChatMessageDto): Promise<{
        reply: string;
        suggestedPrompts: string[];
    }>;
    saveMessage(payload: SaveChatMessageDto): Promise<{
        saved: boolean;
    }>;
    private appendMessages;
    private inferFocus;
}
