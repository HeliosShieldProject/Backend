import { env } from "@/config/env";
import { PrismaService } from "@/data/prisma.service";
import { DeviceService } from "@/modules/device/device.service";
import { AddDeviceDto } from "@/modules/device/dto";
import { HttpException, Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { UserDeviceDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deviceService: DeviceService,
  ) {}

  async signUp(
    email: string,
    password: string,
    device: AddDeviceDto,
  ): Promise<UserDeviceDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new HttpException("User already exists", 400);
    }

    const existingDevice = await this.prisma.device.findFirst({
      where: {
        name: device.name,
        os: device.os,
      },
    });

    if (existingDevice) {
      throw new HttpException("Device already used by another user", 400);
    }

    const hashedPassword = await hash(password, env.SALT);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        devices: {
          create: {
            name: device.name,
            os: device.os,
          },
        },
      },
      include: {
        devices: true,
      },
    });

    return {
      userId: newUser.id,
      deviceId: newUser.devices[0].id,
    };
  }

  async signIn(
    email: string,
    password: string,
    device: AddDeviceDto,
  ): Promise<UserDeviceDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException("User not found", 404);
    }

    if (!(await compare(password, user.password))) {
      throw new HttpException("Invalid password", 400);
    }

    const userDevice = await this.prisma.device.findFirst({
      where: {
        name: device.name,
        os: device.os,
        userId: user.id,
      },
    });

    if (!userDevice) {
      await this.deviceService.addDevice(user.id, device);
    }

    return {
      userId: user.id,
      deviceId: userDevice.id,
    };
  }
}
