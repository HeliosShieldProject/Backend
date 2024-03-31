import { AddDeviceDto } from "@/modules/device/dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SignDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  device: AddDeviceDto;
}
