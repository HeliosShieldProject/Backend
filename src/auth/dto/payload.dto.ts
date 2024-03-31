import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class PayloadDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  deviceId: string;
}
