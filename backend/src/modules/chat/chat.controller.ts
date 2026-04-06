import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChatMessageDto, SaveChatMessageDto } from "./dto/chat-message.dto";
import { ChatService } from "./chat.service";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("history")
  @ApiOperation({ summary: "Get chat history for a saved conversation" })
  history(@Query("sessionId") sessionId: string) {
    return this.chatService.history(sessionId);
  }

  @Post("respond")
  @ApiOperation({ summary: "Get a chat response for the chat hub composer" })
  respond(@Body() payload: ChatMessageDto) {
    return this.chatService.respond(payload);
  }

  @Post("messages")
  @ApiOperation({ summary: "Save a chat message without generating a response" })
  saveMessage(@Body() payload: SaveChatMessageDto) {
    return this.chatService.saveMessage(payload);
  }
}
