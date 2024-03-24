import { ApiProperty } from "@nestjs/swagger";
import { Country } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";

export class CreateSessionDto {
  @ApiProperty()
  @IsUUID()
  deviceId: string;

  @ApiProperty({ enum: Country })
  @IsEnum(Country)
  country: Country;
}
