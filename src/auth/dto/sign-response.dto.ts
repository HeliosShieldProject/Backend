import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class SignResponseDto {
  @ApiProperty()
  @IsJWT()
  accessToken: string;

  @ApiProperty()
  @IsJWT()
  refreshToken: string;
}
