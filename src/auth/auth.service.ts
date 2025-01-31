import { env } from "@/config/env";
import { PrismaService } from "@/data/prisma.service";
import { AddDeviceDto } from "@/modules/device/dto";
import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { SignInDto, SignResponseDto, UserDeviceDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(
    userId: string,
    deviceId: string,
  ): Promise<SignResponseDto> {
    const payload = {
      userId,
      deviceId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: "1d",
      }),
      this.jwtService.signAsync(payload, {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: "7d",
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(
    email: string,
    password: string,
    device: AddDeviceDto,
  ): Promise<SignResponseDto> {
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

    const tokens = await this.generateTokens(newUser.id, newUser.devices[0].id);
    return tokens;
  }

  async signIn({
    user,
    password,
    device,
  }: SignInDto): Promise<SignResponseDto> {
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException("Invalid password", 400);
    }

    const tokens = await this.generateTokens(user.id, device.id);
    return tokens;
  }

  async refresh({ userId, deviceId }: UserDeviceDto) {
    return await this.generateTokens(userId, deviceId);
  }

  async logout({ deviceId }: UserDeviceDto) {
    await this.prisma.device.update({
      where: {
        id: deviceId,
      },
      data: {
        status: "REVOKED",
      },
    });

    const session = await this.prisma.session.findFirst({
      where: {
        deviceId,
        status: "ACTIVE",
      },
    });

    if (session) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
          config: {
            update: {
              status: "NOT_IN_USE",
            },
          },
        },
      });
    }

    return {
      message: "Logged out successfully",
    };
  }

  async changePassword({ userId, deviceId }: UserDeviceDto, password: string) {
    const hashedPassword = await hash(password, env.SALT);

    const currentPassword = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (compare(password, currentPassword.password)) {
      throw new HttpException(
        "New password cannot be the same as the current password",
        400,
      );
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: "Password changed successfully",
    };
  }
}
