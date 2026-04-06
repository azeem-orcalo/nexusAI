import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class CreateAgentTaskMessageDto {
  @ApiProperty()
  @IsString()
  text!: string;

  @ApiProperty()
  @IsString()
  @IsIn(["assistant", "user"])
  role!: "assistant" | "user";
}
