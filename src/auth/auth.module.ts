import { PrismaService } from "@/data/prisma.service";
import { DeviceService } from "@/modules/device/device.service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  providers: [DeviceService, PrismaService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
