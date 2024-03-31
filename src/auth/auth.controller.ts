import { Body, Controller, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignDto } from "./dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @ApiCreatedResponse({ description: "User signed up successfully" })
  async signUp(@Body() body: SignDto) {
    return await this.authService.signUp(
      body.email,
      body.password,
      body.device,
    );
  }

  @Post("sign-in")
  async signIn(@Body() body: SignDto) {
    return await this.authService.signIn(
      body.email,
      body.password,
      body.device,
    );
  }
}
