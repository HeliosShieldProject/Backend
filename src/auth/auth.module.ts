import { PrismaService } from "@/data/prisma.service";
import { DeviceService } from "@/modules/device/device.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessStrategy } from "./strategies/access.strategy";
import { RefreshStrategy } from "./strategies/refresh.strategy";

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [
    DeviceService,
    PrismaService,
    AuthService,
    AccessStrategy,
    RefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
