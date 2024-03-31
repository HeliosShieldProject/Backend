import {
  CloseSessionDto,
  CreateSessionDto,
  HistoryDto,
  SessionDto,
} from "@/modules/session/dto";
import {
  ParseQueryToCountriesArrayPipe,
  ParseQueryToDevicesArrayPipe,
} from "@/modules/session/pipes";
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
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Country } from "@prisma/client";
import { SessionService } from "./session.service";

@Controller("session")
@ApiTags("session")
export class SessionController {
  constructor(private readonly sessionsService: SessionService) {}

  @Post()
  @ApiCreatedResponse({ type: SessionDto })
  @ApiNotFoundResponse({ description: "Device or Country not found" })
  async createSession(@Body() body: CreateSessionDto) {
    const session = await this.sessionsService.createSession(body);
    return session;
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK })
  @ApiNotFoundResponse({ description: "Session not found" })
  async closeSession(@Body() body: CloseSessionDto) {
    await this.sessionsService.closeSessionById(body.sessionId);
  }

  @Get("/history/:userId")
  @ApiResponse({ status: HttpStatus.OK, type: [HistoryDto] })
  @ApiNotFoundResponse({ description: "User not found" })
  async getHistory(
    @Param("userId", ParseUUIDPipe) userId,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query("offset", new ParseIntPipe({ optional: true })) offset: number = 0,
    @Query("devices", ParseQueryToDevicesArrayPipe)
    devices?: string[],
    @Query("countries", ParseQueryToCountriesArrayPipe)
    countries?: Country[],
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
