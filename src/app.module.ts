import { AuthModule } from "@/auth/auth.module";
import { ConfigModule } from "@/modules/config/config.module";
import { DeviceModule } from "@/modules/device/device.module";
import { SessionModule } from "@/modules/session/session.module";
import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [AuthModule, SessionModule, ConfigModule, DeviceModule],
  providers: [Logger, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
