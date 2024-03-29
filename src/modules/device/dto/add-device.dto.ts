import { ApiProperty } from "@nestjs/swagger";
import { OS } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class AddDeviceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: OS })
  @IsEnum(OS)
  os: OS;
}
