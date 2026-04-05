import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateSettingsDto {
  @ApiProperty({ required: false, example: "en" })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false, example: "builder" })
  @IsOptional()
  @IsString()
  persona?: string;
}
