import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { Model, ModelSchema } from "../models/schemas/model.schema";
import {
  ChatConversation,
  ChatConversationSchema
} from "./schemas/chat-conversation.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Model.name, schema: ModelSchema },
      { name: ChatConversation.name, schema: ChatConversationSchema }
    ])
  ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
