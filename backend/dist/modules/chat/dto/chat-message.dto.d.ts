export declare class ChatAttachmentDto {
    kind: "audio" | "camera" | "file" | "screen" | "video";
    name: string;
    sizeLabel?: string;
}
export declare class ChatMessageDto {
    sessionId: string;
    message: string;
    modelId?: string;
    attachments?: ChatAttachmentDto[];
}
export declare class SaveChatMessageDto {
    sessionId: string;
    message: string;
    role: "assistant" | "user";
    attachments?: ChatAttachmentDto[];
}
