import { ConfigService } from "@/modules/config/config.service";
import { Body, Controller, Post } from "@nestjs/common";
import { SessionStatus } from "@prisma/client";
import { CreateSessionDto } from "./dto/create-session.dto";
import { SessionService } from "./session.service";

@Controller("session")
export class SessionController {
  constructor(
    private readonly sessionsService: SessionService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async createSession(@Body() body: CreateSessionDto) {
    const session = await this.sessionsService.session({
      id: body.deviceId,
      status: SessionStatus.ACTIVE,
    });
    if (session) {
      return session;
    }
    const config = await this.configService.configByCountry(body.country);
    return this.sessionsService.createSession({
      config: {
        connect: {
          id: config.id,
        },
      },
      device: {
        connect: {
          id: body.deviceId,
        },
      },
    });
  }
}
