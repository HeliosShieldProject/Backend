import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class DeviceDto {
  @ApiProperty()
  @IsUUID()
  deviceId: string;
}
