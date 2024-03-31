import { ApiProperty } from "@nestjs/swagger";
import { Country } from "@prisma/client";
import { IsEnum } from "class-validator";

export class CreateSessionDto {
  @ApiProperty({ enum: Country })
  @IsEnum(Country)
  country: Country;
}
