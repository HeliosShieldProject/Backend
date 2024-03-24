import {
  CloseSessionDto,
  CreateSessionDto,
  SessionDto,
} from "@/modules/session/dto";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { SessionService } from "./session.service";

@Controller("session")
@ApiTags("session")
export class SessionController {
  constructor(private readonly sessionsService: SessionService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: SessionDto })
  async createSession(@Body() body: CreateSessionDto) {
    const session = await this.sessionsService.createSession(body);
    return session;
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, description: "Session closed" })
  async closeSession(@Body() body: CloseSessionDto) {
    await this.sessionsService.closeSessionById(body.sessionId);
  }

  @Get("/history/:userId")
  @ApiResponse({ status: HttpStatus.OK, type: SessionDto })
  async getHistory(
    @Param("userId", ParseUUIDPipe) userId,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query("offset", new ParseIntPipe({ optional: true })) offset: number = 0,
    @Query("devices") devices?: string,
    @Query("countries") countries?: string,
  ) {
    const sessions = await this.sessionsService.getHistory(
      userId,
      limit,
      offset,
      devices,
      countries,
    );
    return sessions;
  }
}
