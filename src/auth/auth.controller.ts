import { AccessGuard, RefreshGuard } from "@/common/guards";
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RequestDto, SignDto, SignInDto } from "./dto";
import { SignInPipe } from "./pipes";

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
  @ApiResponse({ status: 200, description: "User signed in successfully" })
  @UsePipes(SignInPipe)
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @Get("refresh")
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: RequestDto) {
    return this.authService.refresh(req.user);
  }

  @Post("logout")
  @UseGuards(AccessGuard)
  async logout(@Req() req: RequestDto) {
    return this.authService.logout(req.user);
  }
}
