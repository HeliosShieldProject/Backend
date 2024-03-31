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
export class ParseDevicePipe implements PipeTransform {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async transform(value: string, metadata: ArgumentMetadata) {
    const device = await this.prisma.device.findUnique({
      where: { id: value },
    });

    if (!device) {
      throw new HttpException(`Device ${value} not found`, 404);
    }

    return device.id as UUID;
  }
}
