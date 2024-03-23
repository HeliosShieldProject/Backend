import { PrismaService } from "@/data/prisma.service";
import { Injectable } from "@nestjs/common";
import { ConfigStatus, Country, Prisma } from "@prisma/client";

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async config(configWhereUniqueInput: Prisma.ConfigWhereUniqueInput) {
    return this.prisma.config.findUnique({
      where: configWhereUniqueInput,
    });
  }

  async configs(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ConfigWhereUniqueInput;
    where?: Prisma.ConfigWhereInput;
    orderBy?: Prisma.ConfigOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.config.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createConfigByCountry(country: Country) {
    // {"privateKey":"iEGDq91WOScjNULjjfcK/+49Em72HsG5rR1fFQJfw3Y=","userIp":"24.0.0.14"}
    const server = await this.prisma.server.findFirst({
      where: {
        country,
      },
    });
    // const response = await fetch(`http://${server.serverUri}/configs`, {
    //   method: "POST",
    // });
    // const data = (await response.json()) as {
    //   privateKey: string;
    //   userIp: string;
    // };
    const data = {
      privateKey: "iEGDq91WOScjNULjjfcK/+49Em72HsG5rR1fFQJfw3Y=",
      userIp: "24.0.0.14",
    };
    return this.prisma.config.create({
      data: {
        privateKey: data.privateKey,
        userIp: data.userIp,
        status: ConfigStatus.IN_USE,
        server: {
          connect: {
            id: server.id,
          },
        },
      },
      include: {
        server: true,
      },
    });
  }

  async updateConfig(params: {
    where: Prisma.ConfigWhereUniqueInput;
    data: Prisma.ConfigUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.config.update({
      data,
      where,
    });
  }

  async deleteConfig(where: Prisma.ConfigWhereUniqueInput) {
    return this.prisma.config.delete({
      where,
    });
  }

  async configByCountry(country: Country) {
    let config = await this.prisma.config.findFirst({
      where: {
        status: ConfigStatus.NOT_IN_USE,
        server: {
          country,
        },
      },
      include: {
        server: true,
      },
    });

    if (!config) {
      config = await this.createConfigByCountry(country);
    } else {
      await this.updateConfig({
        where: {
          id: config.id,
        },
        data: {
          status: ConfigStatus.IN_USE,
        },
      });
    }

    return config;
  }
}
