import { PrismaService } from "@/data/prisma.service";
import { ConfigService } from "@/modules/config/config.service";
import { Logger, Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";

@Module({
  providers: [PrismaService, SessionService, ConfigService, Logger],
  controllers: [SessionController],
})
export class SessionModule {}
