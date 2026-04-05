import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: "users" })
export class User {
  @ApiProperty()
  @Prop({ required: true })
  fullName!: string;

  @ApiProperty()
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @ApiProperty()
  @Prop({ required: true })
  passwordHash!: string;

  @ApiProperty()
  @Prop({ default: "en" })
  language!: string;

  @ApiProperty()
  @Prop({ default: true })
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
