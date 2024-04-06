import { UserDeviceDto } from "@/auth/dto";
import { Meta } from "./meta.type";

export interface InfoParams {
  message: string;
  level: string;
  timestamp: string;
  source: string;
  server: string;
  meta: Meta;
  from: UserDeviceDto | string;
}
