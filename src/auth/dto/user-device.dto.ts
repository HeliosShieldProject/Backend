import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class UserDeviceDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  deviceId: string;
}
