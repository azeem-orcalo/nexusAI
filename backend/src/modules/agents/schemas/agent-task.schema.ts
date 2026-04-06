import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export class AgentTaskMessage {
  @ApiProperty()
  @Prop({ required: true, enum: ["assistant", "user"] })
  role!: "assistant" | "user";

  @ApiProperty()
  @Prop({ required: true })
  text!: string;

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt!: Date;
}

@Schema({ _id: false })
export class AgentTaskMessageSchemaClass extends AgentTaskMessage {}

export const AgentTaskMessageSchema = SchemaFactory.createForClass(
  AgentTaskMessageSchemaClass
);

export type AgentTaskDocument = HydratedDocument<AgentTask>;

@Schema({ timestamps: true, collection: "agent_tasks" })
export class AgentTask {
  @ApiProperty()
  @Prop({ required: true })
  agentId!: string;

  @ApiProperty()
  @Prop({ required: true })
  name!: string;

  @ApiProperty()
  @Prop({ default: false })
  completed!: boolean;

  @ApiProperty({ type: [AgentTaskMessage] })
  @Prop({ type: [AgentTaskMessageSchema], default: [] })
  messages!: AgentTaskMessage[];
}

export const AgentTaskSchema = SchemaFactory.createForClass(AgentTask);
