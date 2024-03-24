import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class DeviceDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
