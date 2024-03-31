import { RequestDto } from "@/auth/dto";
import { AccessGuard } from "@/common/guards";
import { Controller, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DeviceService } from "./device.service";

@Controller("device")
@ApiTags("device")
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @UseGuards(AccessGuard)
  async getDevices(@Req() req: RequestDto) {
    return await this.deviceService.getDevices(req.user.userId);
  }

  @Put("/:deviceId")
  @ApiCreatedResponse({ description: "Device removed" })
  @ApiNotFoundResponse({ description: "Device or User not found" })
  @UseGuards(AccessGuard)
  async removeDevice(
    @Req() req: RequestDto,
    @Param("deviceId") deviceId: string,
  ) {
    return await this.deviceService.removeDevice(req.user.userId, deviceId);
  }
}
