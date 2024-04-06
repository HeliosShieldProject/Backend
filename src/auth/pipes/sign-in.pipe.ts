import { PrismaService } from "@/data/prisma.service";
import {
  ArgumentMetadata,
  HttpException,
  Inject,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { OS } from "@prisma/client";
import { z } from "zod";
import { SignDto, SignInDto } from "../dto";

async function validate<T>(value: unknown, schema: z.ZodType<T>) {
  try {
    schema.parse(value);
  } catch (error) {
    throw new HttpException(error.errors, 400);
  }
}

@Injectable()
export class SignInPipe implements PipeTransform {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async transform(
    value: SignDto,
    metadata: ArgumentMetadata,
  ): Promise<SignInDto> {
    const { device, email, password } = value;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    await validate(email, z.string().email());
    await validate(password, z.string());
    await validate(
      device,
      z.object({ name: z.string(), os: z.nativeEnum(OS) }),
    );

    if (!existingUser) {
      throw new HttpException("User not found", 404);
    }

    let existingDevice = await this.prisma.device.findFirst({
      where: {
        name: device.name,
        os: device.os,
        userId: existingUser.id,
      },
    });

    if (!existingDevice) {
      existingDevice = await this.prisma.device.create({
        data: {
          name: device.name,
          os: device.os,
          user: {
            connect: {
              email,
            },
          },
        },
      });
    }

    return {
      user: existingUser,
      device: existingDevice,
      password,
    };
  }
}
