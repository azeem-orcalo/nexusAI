import { ChatMessageDto, SaveChatMessageDto } from "./dto/chat-message.dto";
import { ChatService } from "./chat.service";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
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
}
