import { ApiProperty } from "@nestjs/swagger";

export class SessionDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  userPrivateKey: string;

  @ApiProperty()
  serverPublicKey: string;

  @ApiProperty()
  wireguardUri: string;

  @ApiProperty()
  userIp: string;
}
