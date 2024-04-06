import { UserDeviceDto } from "@/auth/dto";
import { PrismaService } from "@/data/prisma.service";
import { HttpException, Injectable } from "@nestjs/common";
import { Device } from "@prisma/client";

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async getDevices(userId: string): Promise<Device[]> {
    return await this.prisma.device.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async revokeDevice(userId: string, deviceId: string): Promise<void> {
    const device = await this.prisma.device.findFirst({
      where: {
        id: deviceId,
        userId: userId,
      },
    });

    if (!device) {
      throw new HttpException("Device not found", 404);
    }

    await this.prisma.device.update({
      where: {
        id: deviceId,
      },
      data: {
        status: "REVOKED",
      },
    });

    const session = await this.prisma.session.findFirst({
      where: {
        deviceId,
        status: "ACTIVE",
      },
    });

    if (session) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
          config: {
            update: {
              status: "NOT_IN_USE",
            },
          },
        },
      });
    }
  }

  async revokeOtherDevices({ userId, deviceId }: UserDeviceDto): Promise<void> {
    const otherDevices = await this.prisma.device.findMany({
      where: {
        userId,
        NOT: {
          id: deviceId,
        },
        status: "ACTIVE",
      },
    });

    if (otherDevices.length === 0) {
      return;
    }

    await this.prisma.device.updateMany({
      where: {
        userId,
        id: {
          in: otherDevices.map((device) => device.id),
        },
      },
      data: {
        status: "REVOKED",
      },
    });

    const sessions = await this.prisma.session.findMany({
      where: {
        deviceId: {
          in: otherDevices.map((device) => device.id),
        },
        status: "ACTIVE",
      },
    });

    for (const session of sessions) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
          config: {
            update: {
              status: "NOT_IN_USE",
            },
          },
        },
      });
    }
  }
}
