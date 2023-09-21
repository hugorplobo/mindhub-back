import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post("login")
    async login(
        @Body() { username, password }: LoginDTO
    ) {
        return this.authService.signIn(username, password);
    }
}