import { AddDeviceDto } from "@/modules/device/dto";
import { ApiProperty } from "@nestjs/swagger";

export class SignDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  device: AddDeviceDto;
}
