import { ApiProperty } from "@nestjs/swagger";
import { Country } from "@prisma/client";

export class CreateSessionDto {
  @ApiProperty() deviceId: string;
  @ApiProperty({ enum: Country }) country: Country;
}
