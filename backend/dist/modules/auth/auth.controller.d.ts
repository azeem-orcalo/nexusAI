import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(payload: SignUpDto): {
        id: string;
        fullName: string;
        email: string;
        language: string;
        token: string;
    };
    signIn(payload: SignInDto): {
        id: string;
        email: string;
        token: string;
    };
    me(): {
        id: string;
        fullName: string;
        email: string;
        language: string;
        isActive: boolean;
    };
}
