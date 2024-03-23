import { ConfigModule } from "@/modules/config/config.module";
import { SessionModule } from "@/modules/session/session.module";
import { UserModule } from "@/modules/user/user.module";
import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    UserModule,
    SessionModule,
    ConfigModule,
  ],
})
export class AppModule {}
