import { PrismaService } from "@/data/prisma.service";
import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";

@Module({
  providers: [DeviceService, PrismaService],
  controllers: [DeviceController],
})
export class DeviceModule {}
