import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class SignInDto {
  @ApiProperty({ example: "azeem@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "secret123" })
  @IsString()
  password!: string;
}
