import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model as MongooseModel } from "mongoose";
import { ChatMessageDto, SaveChatMessageDto } from "./dto/chat-message.dto";
import { Model as MarketplaceModel, ModelDocument } from "../models/schemas/model.schema";
import {
  ChatConversation,
  ChatConversationDocument
} from "./schemas/chat-conversation.schema";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(MarketplaceModel.name)
    private readonly modelStore: MongooseModel<ModelDocument>,
    @InjectModel(ChatConversation.name)
    private readonly chatStore: MongooseModel<ChatConversationDocument>
  ) {}

  async history(sessionId: string) {
    const conversation = await this.chatStore
      .findOne({ sessionId })
      .lean()
      .exec();

    return {
      sessionId,
      messages:
        conversation?.messages.map((message) => ({
          role: message.role,
          text: message.text,
          attachments: message.attachments ?? [],
          createdAt: message.createdAt
        })) ?? []
    };
  }

  async respond(payload: ChatMessageDto) {
    const trimmedMessage = payload.message.trim();
    const selectedModel = payload.modelId
      ? await this.modelStore.findOne({ slug: payload.modelId }).lean().exec()
      : null;

    const attachmentSummary =
      payload.attachments && payload.attachments.length > 0
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

  async saveMessage(payload: SaveChatMessageDto) {
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

  private async appendMessages(
    sessionId: string,
    messages: Array<{
      role: "assistant" | "user";
      text: string;
      attachments: Array<{ kind: string; name: string; sizeLabel?: string }>;
      createdAt: Date;
    }>
  ) {
    await this.chatStore
      .updateOne(
        { sessionId },
        {
          $setOnInsert: { sessionId },
          $push: { messages: { $each: messages } }
        },
        { upsert: true }
      )
      .exec();
  }

  private inferFocus(message: string): string {
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
}
