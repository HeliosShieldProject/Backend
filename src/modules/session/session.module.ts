import { PrismaService } from "@/data/prisma.service";
import { ConfigService } from "@/modules/config/config.service";
import { Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";

@Module({
  providers: [PrismaService, SessionService, ConfigService],
  controllers: [SessionController],
})
export class SessionModule {}
