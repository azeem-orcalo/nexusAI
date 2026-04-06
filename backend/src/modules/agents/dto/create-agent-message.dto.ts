import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAgentMessageDto {
  @ApiProperty()
  @IsString()
  text!: string;
}
