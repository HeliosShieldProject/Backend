import { AuthModule } from "@/auth/auth.module";
import { ConfigModule } from "@/modules/config/config.module";
import { DeviceModule } from "@/modules/device/device.module";
import { SessionModule } from "@/modules/session/session.module";
import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthModule,
    SessionModule,
    ConfigModule,
    DeviceModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
