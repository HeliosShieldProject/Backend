import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CloseSessionDto {
  @ApiProperty()
  @IsUUID()
  sessionId: string;
}
