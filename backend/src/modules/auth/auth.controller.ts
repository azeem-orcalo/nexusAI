import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @ApiOperation({ summary: "Create a new user account" })
  signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  @Post("sign-in")
  @ApiOperation({ summary: "Authenticate an existing user" })
  signIn(@Body() payload: SignInDto) {
    return this.authService.signIn(payload);
  }

  @Get("me")
  @ApiOperation({ summary: "Fetch the current user profile" })
  me() {
    return this.authService.me();
  }
}
