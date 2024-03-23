import { PrismaService } from "@/data/prisma.service";
import { Injectable } from "@nestjs/common";
import { ConfigStatus, Prisma, SessionStatus } from "@prisma/client";

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async session(sessionWhereUniqueInput: Prisma.SessionWhereUniqueInput) {
    return this.prisma.session.findUnique({
      where: sessionWhereUniqueInput,
    });
  }

  async sessions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SessionWhereUniqueInput;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.session.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createSession(data: Prisma.SessionCreateInput) {
    return this.prisma.session.create({
      data,
    });
  }

  async updateSession(params: {
    where: Prisma.SessionWhereUniqueInput;
    data: Prisma.SessionUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.session.update({
      data,
      where,
    });
  }

  async closeSessionByDevice(deviceId: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        deviceId,
        status: SessionStatus.ACTIVE,
      },
    });
    return this.prisma.session.update({
      data: {
        closedAt: new Date(),
        status: SessionStatus.CLOSED,
        config: {
          update: {
            status: ConfigStatus.NOT_IN_USE,
          },
        },
      },
      where: {
        id: session.id,
      },
      include: {
        config: true,
      },
    });
  }
}
