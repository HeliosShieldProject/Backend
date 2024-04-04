import { Country, PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { env } from "process";
const prisma = new PrismaClient();

async function main() {
  // Create users
  const vitya = await prisma.user.create({
    data: {
      email: "vitya@gmail.com",
      password: await hash("1234", Number(env.SALT)),
    },
  });

  const kolya = await prisma.user.create({
    data: {
      email: "kolya@gmail.com",
      password: await hash("1234", Number(env.SALT)),
    },
  });

  // Create servers
  const serverUK = await prisma.server.create({
    data: {
      country: Country.UK,
      publicKey: "publicKey1",
      backendUri: "10.0.0.1:8080",
      wireguardUri: "24.0.0.1:51820",
    },
  });

  const serverUSA = await prisma.server.create({
    data: {
      country: Country.USA,
      publicKey: "publicKey2",
      backendUri: "11.0.0.1:8080",
      wireguardUri: "24.0.0.2:51820",
    },
  });

  const serverGermany = await prisma.server.create({
    data: {
      country: Country.Germany,
      publicKey: "publicKey3",
      backendUri: "12.0.0.1:8080",
      wireguardUri: "24.0.0.3:51820",
    },
  });

  // Create configs
  const configUK1 = await prisma.config.create({
    data: {
      serverId: serverUK.id,
      privateKey: "privateKey1",
      userIp: "24.0.0.2",
    },
  });

  const configUK2 = await prisma.config.create({
    data: {
      serverId: serverUK.id,
      privateKey: "privateKey2",
      userIp: "24.0.0.3",
    },
  });

  const configUK3 = await prisma.config.create({
    data: {
      serverId: serverUK.id,
      privateKey: "privateKey3",
      userIp: "24.0.0.4",
    },
  });

  const configUSA1 = await prisma.config.create({
    data: {
      serverId: serverUSA.id,
      privateKey: "privateKey4",
      userIp: "24.0.0.2",
    },
  });

  const configUSA2 = await prisma.config.create({
    data: {
      serverId: serverUSA.id,
      privateKey: "privateKey5",
      userIp: "24.0.0.3",
    },
  });

  const configUSA3 = await prisma.config.create({
    data: {
      serverId: serverUSA.id,
      privateKey: "privateKey6",
      userIp: "24.0.0.4",
    },
  });

  const configGermany1 = await prisma.config.create({
    data: {
      serverId: serverGermany.id,
      privateKey: "privateKey7",
      userIp: "24.0.0.2",
    },
  });

  const configGermany2 = await prisma.config.create({
    data: {
      serverId: serverGermany.id,
      privateKey: "privateKey8",
      userIp: "24.0.0.3",
    },
  });

  const configGermany3 = await prisma.config.create({
    data: {
      serverId: serverGermany.id,
      privateKey: "privateKey9",
      userIp: "24.0.0.4",
    },
  });

  // Create devices
  const device1 = await prisma.device.create({
    data: {
      userId: vitya.id,
      os: "android",
      name: "device1",
    },
  });

  const device2 = await prisma.device.create({
    data: {
      userId: vitya.id,
      os: "iOS",
      name: "device2",
    },
  });

  const device3 = await prisma.device.create({
    data: {
      userId: kolya.id,
      os: "windows",
      name: "device3",
    },
  });

  const device4 = await prisma.device.create({
    data: {
      userId: kolya.id,
      os: "macOS",
      name: "device4",
    },
  });

  const device5 = await prisma.device.create({
    data: {
      userId: kolya.id,
      os: "linux",
      name: "device5",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
