import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type ModelDocument = HydratedDocument<Model>;

@Schema({ timestamps: true, collection: "models" })
export class Model {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  slug!: string;

  @ApiProperty()
  @Prop({ required: true })
  name!: string;

  @ApiProperty()
  @Prop({ required: true })
  provider!: string;

  @ApiProperty()
  @Prop({ required: true })
  category!: string;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  useCases!: string[];

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  tags!: string[];

  @ApiProperty()
  @Prop({ required: true })
  description!: string;

  @ApiProperty()
  @Prop({ required: true })
  pricePerMillion!: string;

  @ApiProperty()
  @Prop({ default: 0 })
  averageRating!: number;

  @ApiProperty()
  @Prop({ default: 0 })
  contextWindow!: number;

  @ApiProperty()
  @Prop({ default: 0 })
  latencyMs!: number;
}

export const ModelSchema = SchemaFactory.createForClass(Model);
