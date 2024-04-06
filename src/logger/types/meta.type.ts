import { UserDeviceDto } from "@/auth/dto";

export interface Meta {
  request: {
    originalUrl: string;
    body: { [key: string]: string };
    method: string;
    headers: { [key: string]: string | string[] };
    from: UserDeviceDto | undefined;
  };

  response: {
    statusCode: number;
  };
}
