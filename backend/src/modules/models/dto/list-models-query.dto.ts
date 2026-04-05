import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class ListModelsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  useCase?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priceModel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  minRating?: string;
}
