import { ApiProperty } from "@nestjs/swagger";
import { Country, SessionStatus } from "@prisma/client";

class Device {
  @ApiProperty()
  name: string;

  @ApiProperty()
  os: string;
}

export class HistoryDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty({ enum: SessionStatus })
  status: SessionStatus;

  @ApiProperty()
  openedAt: Date;

  @ApiProperty()
  closedAt?: Date;

  @ApiProperty()
  device: Device;

  @ApiProperty({ enum: Country })
  country: Country;
}
