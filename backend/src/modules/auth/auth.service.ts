import { Injectable } from "@nestjs/common";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class AuthService {
  signUp(payload: SignUpDto) {
    return {
      id: "usr_001",
      fullName: payload.fullName,
      email: payload.email,
      language: "en",
      token: "mock-jwt-token"
    };
  }

  signIn(payload: SignInDto) {
    return {
      id: "usr_001",
      email: payload.email,
      token: "mock-jwt-token"
    };
  }

  me() {
    return {
      id: "usr_001",
      fullName: "Azeem Aslam",
      email: "azeem@example.com",
      language: "en",
      isActive: true
    };
  }
}
