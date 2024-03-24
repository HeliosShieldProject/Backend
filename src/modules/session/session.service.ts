import { PrismaService } from "@/data/prisma.service";
import { ConfigService } from "@/modules/config/config.service";
import { CreateSessionDto, SessionDto } from "@/modules/session/dto";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigStatus, Country, SessionStatus } from "@prisma/client";

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(data: CreateSessionDto): Promise<SessionDto> {
    const device = await this.prisma.device.findUnique({
      where: {
        id: data.deviceId,
      },
    });
    if (!device) {
      throw new HttpException("Device not found", 404);
    }

    const session = await this.prisma.session.findFirst({
      where: {
        deviceId: data.deviceId,
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
        serverPublicKey: session.config.server.publicKey,
        wireguardUri: session.config.server.wireguardUri,
        userIp: session.config.userIp,
        userPrivateKey: session.config.privateKey,
      };
    }

    const activeSession = await this.prisma.session.findFirst({
      where: {
        deviceId: data.deviceId,
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
            id: device.id,
          },
        },
      },
      select: {
        config: {
          include: {
            server: true,
          },
        },
      },
    });

    return {
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

  async validateDevices(devices: string, userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException(`User ${userId} not found`, 404);
    }

    if (!devices) {
      return await this.prisma.device
        .findMany({
          where: {
            userId,
          },
          select: {
            id: true,
          },
        })
        .then((devices) => devices.map((device) => device.id));
    }
    const deviceIds = devices.split(",");
    for (const deviceId of deviceIds) {
      const device = await this.prisma.device.findUnique({
        where: {
          id: deviceId,
          userId,
        },
      });
      if (!device) {
        throw new HttpException(`Device ${deviceId} not found`, 404);
      }
    }
    return deviceIds;
  }

  async validateCountries(countries?: string): Promise<Country[]> {
    if (!countries) {
      return Object.values(Country);
    }
    const countryCodes = countries.split(",") as Country[];
    countryCodes.forEach((countryCode) => {
      if (Country[countryCode] === undefined) {
        throw new HttpException(`Country ${countryCode} not found`, 404);
      }
      return Country[countryCode];
    });
    return countryCodes;
  }

  async getHistory(
    userId: string,
    limit: number,
    offset: number,
    devices?: string,
    countries?: string,
  ) {
    const validatedDevices = await this.validateDevices(devices, userId);
    const validatedCountries = await this.validateCountries(countries);
    return this.prisma.session.findMany({
      where: {
        device: {
          userId,
          id: {
            in: validatedDevices,
          },
        },
        config: {
          server: {
            country: {
              in: validatedCountries,
            },
          },
        },
      },
      take: limit,
      skip: offset,
    });
  }
}
