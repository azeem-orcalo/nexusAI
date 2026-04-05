import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true, collection: "reviews" })
export class Review {
  @ApiProperty()
  @Prop({ required: true })
  modelId!: string;

  @ApiProperty()
  @Prop({ required: true })
  authorName!: string;

  @ApiProperty()
  @Prop({ required: true, min: 1, max: 5 })
  rating!: number;

  @ApiProperty()
  @Prop({ required: true })
  comment!: string;

  @ApiProperty()
  @Prop({ default: true })
  verified!: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
