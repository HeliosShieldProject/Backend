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

  async removeDevice(userId: string, deviceId: string): Promise<void> {
    const device = await this.prisma.device.findFirst({
      where: {
        id: deviceId,
        userId: userId,
      },
    });

    if (!device) {
      throw new HttpException("Device not found", 404);
    }

    await this.prisma.device.delete({
      where: {
        id: deviceId,
      },
    });
  }
}
