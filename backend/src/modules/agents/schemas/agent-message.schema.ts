import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type AgentMessageDocument = HydratedDocument<AgentMessage>;

@Schema({ timestamps: true, collection: "agent_messages" })
export class AgentMessage {
  @ApiProperty()
  @Prop({ required: true })
  agentId!: string;

  @ApiProperty()
  @Prop({ required: true, enum: ["assistant", "user"] })
  role!: "assistant" | "user";

  @ApiProperty()
  @Prop({ required: true })
  text!: string;
}

export const AgentMessageSchema = SchemaFactory.createForClass(AgentMessage);
