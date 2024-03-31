import { AddDeviceDto } from "@/modules/device/dto";
import { ApiProperty } from "@nestjs/swagger";
import { Country, SessionStatus } from "@prisma/client";

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
  device: AddDeviceDto;

  @ApiProperty({ enum: Country })
  country: Country;
}
