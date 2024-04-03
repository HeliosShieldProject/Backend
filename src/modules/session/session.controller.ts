import { RequestDto } from "@/auth/dto";
import { AccessGuard } from "@/common/guards";
import {
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
  Logger,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
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
  constructor(
    private readonly sessionsService: SessionService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: SessionDto })
  @ApiNotFoundResponse({ description: "Device or Country not found" })
  @UseGuards(AccessGuard)
  async createSession(@Req() req: RequestDto, @Body() body: CreateSessionDto) {
    const session = await this.sessionsService.createSession(
      req.user.deviceId,
      body,
    );
    return session;
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK })
  @ApiNotFoundResponse({ description: "Session not found" })
  @UseGuards(AccessGuard)
  async closeSession(@Req() req: RequestDto) {
    await this.sessionsService.closeSession(req.user.deviceId);
  }

  @Get("/history")
  @ApiResponse({ status: HttpStatus.OK, type: [HistoryDto] })
  @ApiNotFoundResponse({ description: "User not found" })
  @UseGuards(AccessGuard)
  async getHistory(
    @Req() req: RequestDto,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query("offset", new ParseIntPipe({ optional: true })) offset: number = 0,
    @Query("devices", ParseQueryToDevicesArrayPipe)
    devices?: string[],
    @Query("countries", ParseQueryToCountriesArrayPipe)
    countries?: Country[],
  ) {
    const sessions = await this.sessionsService.getHistory(
      req.user.userId,
      limit,
      offset,
      devices,
      countries,
    );
    return sessions;
  }
}
