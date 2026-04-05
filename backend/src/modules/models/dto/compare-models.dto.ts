import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class CompareModelsDto {
  @ApiProperty({ example: ["gpt-5", "gpt-4o"] })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  modelIds!: string[];
}
