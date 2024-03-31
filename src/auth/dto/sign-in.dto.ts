import { Device, User } from "@prisma/client";

export interface SignInDto {
  user: User;
  device: Device;
  password: string;
}
