import { PrismaService } from "@/data/prisma.service";
import { Injectable } from "@nestjs/common";
import { AddDeviceDto } from "./dto";

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async addDevice(data: AddDeviceDto) {
    // TODO
  }
}
