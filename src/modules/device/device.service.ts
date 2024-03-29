import { PrismaService } from "@/data/prisma.service";
import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { AddDeviceDto, DeviceDto } from "./dto";

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async addDevice(userId: UUID, data: AddDeviceDto): Promise<DeviceDto> {
    const device = await this.prisma.device.findFirst({
      where: {
        name: data.name,
        os: data.os,
        userId: userId,
      },
    });

    if (device) {
      return {
        deviceId: device.id,
      };
    }

    const newDevice = await this.prisma.device.create({
      data: {
        name: data.name,
        os: data.os,
        userId: userId,
      },
    });

    return {
      deviceId: newDevice.id,
    };
  }
}
