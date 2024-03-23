import { PrismaService } from "@/data/prisma.service";
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  providers: [PrismaService, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
