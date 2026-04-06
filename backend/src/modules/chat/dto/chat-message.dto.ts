import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";

export class ChatAttachmentDto {
  @ApiProperty()
  @IsString()
  @IsIn(["audio", "camera", "file", "screen", "video"])
  kind!: "audio" | "camera" | "file" | "screen" | "video";

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sizeLabel?: string;
}

export class ChatMessageDto {
  @ApiProperty()
  @IsString()
  sessionId!: string;

  @ApiProperty()
  @IsString()
  message!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  modelId?: string;

  @ApiPropertyOptional({ type: [ChatAttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatAttachmentDto)
  attachments?: ChatAttachmentDto[];
}

export class SaveChatMessageDto {
  @ApiProperty()
  @IsString()
  sessionId!: string;

  @ApiProperty()
  @IsString()
  message!: string;

  @ApiProperty()
  @IsString()
  @IsIn(["assistant", "user"])
  role!: "assistant" | "user";

  @ApiPropertyOptional({ type: [ChatAttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatAttachmentDto)
  attachments?: ChatAttachmentDto[];
}
