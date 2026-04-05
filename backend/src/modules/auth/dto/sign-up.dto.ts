import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @ApiProperty({ example: "Azeem Aslam" })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: "azeem@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "secret123" })
  @IsString()
  @MinLength(8)
  password!: string;
}
