import { PrismaService } from "@/data/prisma.service";
import {
  ArgumentMetadata,
  HttpException,
  Inject,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { UUID } from "crypto";

@Injectable()
export class ParseQueryToDevicesArrayPipe implements PipeTransform<string> {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      return;
    }

    const devices = value.split(",");
    const brokenDevices = [];
    for (const device of devices) {
      const deviceExists = await this.prisma.device.findUnique({
        where: { id: device },
      });
      if (!deviceExists) {
        brokenDevices.push(device);
      }
    }

    if (brokenDevices.length) {
      throw new HttpException(
        `Invalid device id(s): ${brokenDevices.join(", ")}`,
        400,
      );
    }

    return devices as UUID[];
  }
}
