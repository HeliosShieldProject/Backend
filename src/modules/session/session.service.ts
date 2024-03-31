import { PrismaService } from "@/data/prisma.service";
import { ConfigService } from "@/modules/config/config.service";
import {
  CreateSessionDto,
  HistoryDto,
  SessionDto,
} from "@/modules/session/dto";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigStatus, Country, SessionStatus } from "@prisma/client";

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(
    deviceId: string,
    data: CreateSessionDto,
  ): Promise<SessionDto> {
    const session = await this.prisma.session.findFirst({
      where: {
        deviceId: deviceId,
        status: SessionStatus.ACTIVE,
        config: {
          server: {
            country: data.country,
          },
        },
      },
      include: {
        config: {
          include: {
            server: true,
          },
        },
      },
    });

    if (session) {
      return {
        sessionId: session.id,
        serverPublicKey: session.config.server.publicKey,
        wireguardUri: session.config.server.wireguardUri,
        userIp: session.config.userIp,
        userPrivateKey: session.config.privateKey,
      };
    }

    const activeSession = await this.prisma.session.findFirst({
      where: {
        deviceId: deviceId,
        status: SessionStatus.ACTIVE,
      },
    });

    if (activeSession) {
      await this.closeSessionById(activeSession.id);
    }

    const config = await this.configService.configByCountry(data.country);
    const newSession = await this.prisma.session.create({
      data: {
        config: {
          connect: {
            id: config.id,
          },
        },
        device: {
          connect: {
            id: deviceId,
          },
        },
      },
      select: {
        id: true,
        config: {
          include: {
            server: true,
          },
        },
      },
    });

    return {
      sessionId: newSession.id,
      serverPublicKey: newSession.config.server.publicKey,
      wireguardUri: newSession.config.server.wireguardUri,
      userIp: newSession.config.userIp,
      userPrivateKey: newSession.config.privateKey,
    };
  }

  async closeSessionById(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      throw new HttpException("Session not found", 404);
    }

    if (session.status === SessionStatus.CLOSED) {
      throw new HttpException("Session already closed", 400);
    }

    return this.prisma.session.update({
      data: {
        status: SessionStatus.CLOSED,
        closedAt: new Date(),
        config: {
          update: {
            status: ConfigStatus.NOT_IN_USE,
          },
        },
      },
      where: {
        id: sessionId,
      },
    });
  }

  async closeSession(deviceId: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        deviceId: deviceId,
        status: SessionStatus.ACTIVE,
      },
    });

    if (!session) {
      throw new HttpException("Session not found", 404);
    }

    return this.closeSessionById(session.id);
  }

  async getHistory(
    userId: string,
    limit: number,
    offset: number,
    devices?: string[],
    countries?: Country[],
  ): Promise<HistoryDto[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException("User not found", 404);
    }

    const sessions = await this.prisma.session.findMany({
      where: {
        device: {
          id: {
            in: devices,
          },
          userId: user.id,
        },
        config: {
          server: {
            country: {
              in: countries,
            },
          },
        },
      },
      include: {
        config: {
          include: {
            server: true,
          },
        },
        device: true,
      },
      take: limit,
      skip: offset,
    });

    return sessions.map((session) => ({
      sessionId: session.id,
      status: session.status,
      openedAt: session.openedAt,
      closedAt: session.closedAt,
      device: {
        id: session.device.id,
        name: session.device.name,
        os: session.device.os,
      },
      country: session.config.server.country,
    }));
  }
}
