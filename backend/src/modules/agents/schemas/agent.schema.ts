import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type AgentDocument = HydratedDocument<Agent>;

@Schema({ timestamps: true, collection: "agents" })
export class Agent {
  @ApiProperty()
  @Prop({ required: true })
  name!: string;

  @ApiProperty()
  @Prop({ default: "Research & Data" })
  category!: string;

  @ApiProperty()
  @Prop({ required: true })
  purpose!: string;

  @ApiProperty()
  @Prop({ default: "General users" })
  audience!: string;

  @ApiProperty()
  @Prop({ required: true })
  prompt!: string;

  @ApiProperty({ type: [String] })
  @Prop({ type: [String], default: [] })
  tools!: string[];

  @ApiProperty({ type: [String] })
  @Prop({ type: [String], default: [] })
  memory!: string[];

  @ApiProperty({ type: [String] })
  @Prop({ type: [String], default: [] })
  tests!: string[];

  @ApiProperty()
  @Prop({ default: "api" })
  deployTarget!: string;

  @ApiProperty()
  @Prop({ default: "draft" })
  status!: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
