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
export class ParseUserPipe implements PipeTransform {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async transform(value: string, metadata: ArgumentMetadata) {
    const user = await this.prisma.user.findUnique({
      where: { id: value },
    });

    if (!user) {
      throw new HttpException(`User ${value} not found`, 404);
    }

    return user.id as UUID;
  }
}
