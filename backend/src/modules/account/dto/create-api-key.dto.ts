import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateApiKeyDto {
  @ApiProperty({ example: "Local dev key" })
  @IsString()
  label!: string;
}
