import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RecommendationRequestDto {
  @ApiProperty({ example: "I want to build an AI chatbot for customer support" })
  @IsString()
  goal!: string;
}
