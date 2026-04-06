import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ListResearchFeedQueryDto {
  @ApiPropertyOptional({ example: "Reasoning" })
  @IsOptional()
  @IsString()
  category?: string;
}
