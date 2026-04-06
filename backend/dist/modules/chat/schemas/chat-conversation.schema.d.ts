import { HydratedDocument } from "mongoose";
export type ChatConversationDocument = HydratedDocument<ChatConversation>;
export declare class ChatConversationAttachment {
    kind: "audio" | "camera" | "file" | "screen" | "video";
    name: string;
    sizeLabel?: string;
}
export declare class ChatConversationMessage {
    role: "assistant" | "user";
    text: string;
    attachments: ChatConversationAttachment[];
    createdAt: Date;
}
export declare class ChatConversation {
    sessionId: string;
    messages: ChatConversationMessage[];
}
export declare const ChatConversationSchema: import("mongoose").Schema<ChatConversation, import("mongoose").Model<ChatConversation, any, any, any, import("mongoose").Document<unknown, any, ChatConversation, any, {}> & ChatConversation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatConversation, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ChatConversation>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ChatConversation> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
