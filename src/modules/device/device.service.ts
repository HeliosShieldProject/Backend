import { PrismaService } from "@/data/prisma.service";
import { HttpException, Injectable } from "@nestjs/common";
import { DeviceStatus } from "@prisma/client";
import { AddDeviceDto, DeviceDto } from "./dto";

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async addDevice(userId: string, data: AddDeviceDto): Promise<DeviceDto> {
    const device = await this.prisma.device.findFirst({
      where: {
        name: data.name,
        os: data.os,
        userId: userId,
      },
    });

    // TODO: Refactor this
    if (device) {
      switch (device.status) {
        case DeviceStatus.ACTIVE:
          return {
            deviceId: device.id,
          };

        case DeviceStatus.REVOKED:
          await this.prisma.device.update({
            where: {
              id: device.id,
            },
            data: {
              status: DeviceStatus.ACTIVE,
              revokedAt: null,
            },
          });

          return {
            deviceId: device.id,
          };

        case DeviceStatus.BANNED:
          if (device.bannedTill && device.bannedTill > new Date()) {
            throw new HttpException(
              `This device was banned till ${device.bannedTill}`,
              400,
            );
          }

          await this.prisma.device.update({
            where: {
              id: device.id,
            },
            data: {
              status: DeviceStatus.ACTIVE,
              bannedTill: null,
            },
          });

          return {
            deviceId: device.id,
          };

        case DeviceStatus.PERMANENTLY_BANNED:
          throw new HttpException("This device was permanently banned", 400);
      }
    }

    const newDevice = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        devices: {
          create: {
            name: data.name,
            os: data.os,
          },
        },
      },
    });

    return {
      deviceId: newDevice.id,
    };
  }

  async removeDevice(deviceId: string): Promise<void> {
    await this.prisma.device.delete({
      where: {
        id: deviceId,
      },
    });
  }
}
