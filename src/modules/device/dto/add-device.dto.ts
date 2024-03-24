import { ApiProperty } from "@nestjs/swagger";
import { IsMACAddress, IsString, IsUUID } from "class-validator";

export class AddDeviceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  os: string;

  @ApiProperty()
  @IsMACAddress()
  macAddress: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  // TODO: Choose a better fields for the device
}
