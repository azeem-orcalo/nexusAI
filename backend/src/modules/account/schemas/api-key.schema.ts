import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type ApiKeyDocument = HydratedDocument<ApiKey>;

@Schema({ timestamps: true, collection: "api_keys" })
export class ApiKey {
  @ApiProperty()
  @Prop({ required: true })
  userId!: string;

  @ApiProperty()
  @Prop({ required: true })
  label!: string;

  @ApiProperty()
  @Prop({ required: true })
  keyPreview!: string;

  @ApiProperty()
  @Prop({ default: true })
  isActive!: boolean;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
