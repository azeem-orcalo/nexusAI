import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ChatConversationDocument = HydratedDocument<ChatConversation>;

@Schema({ _id: false })
export class ChatConversationAttachment {
  @Prop({ required: true })
  kind!: "audio" | "camera" | "file" | "screen" | "video";

  @Prop({ required: true })
  name!: string;

  @Prop()
  sizeLabel?: string;
}

const ChatConversationAttachmentSchema = SchemaFactory.createForClass(
  ChatConversationAttachment
);

@Schema({ _id: false })
export class ChatConversationMessage {
  @Prop({ required: true, enum: ["assistant", "user"] })
  role!: "assistant" | "user";

  @Prop({ required: true })
  text!: string;

  @Prop({ type: [ChatConversationAttachmentSchema], default: [] })
  attachments!: ChatConversationAttachment[];

  @Prop({ default: Date.now })
  createdAt!: Date;
}

const ChatConversationMessageSchema = SchemaFactory.createForClass(
  ChatConversationMessage
);

@Schema({ timestamps: true, collection: "chat_conversations" })
export class ChatConversation {
  @Prop({ required: true, unique: true, index: true })
  sessionId!: string;

  @Prop({ type: [ChatConversationMessageSchema], default: [] })
  messages!: ChatConversationMessage[];
}

export const ChatConversationSchema =
  SchemaFactory.createForClass(ChatConversation);
