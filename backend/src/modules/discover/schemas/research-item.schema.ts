import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type ResearchItemDocument = HydratedDocument<ResearchItem>;

@Schema({ timestamps: true, collection: "research_items" })
export class ResearchItem {
  @ApiProperty()
  @Prop({ required: true })
  title!: string;

  @ApiProperty()
  @Prop({ required: true })
  summary!: string;

  @ApiProperty()
  @Prop({ required: true })
  provider!: string;

  @ApiProperty()
  @Prop({ required: true })
  publishedAt!: string;

  @ApiProperty()
  @Prop({ default: true })
  trending!: boolean;
}

export const ResearchItemSchema = SchemaFactory.createForClass(ResearchItem);
