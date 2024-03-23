import { AuthModule } from "@/auth/auth.module";
import { UsersModule } from "@/modules/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
