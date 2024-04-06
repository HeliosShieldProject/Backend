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

  @Put("/revoke/:deviceId")
  @ApiCreatedResponse({ description: "Device removed" })
  @ApiNotFoundResponse({ description: "Device or User not found" })
  @UseGuards(AccessGuard)
  async revokeDevice(
    @Req() req: RequestDto,
    @Param("deviceId") deviceId: string,
  ) {
    return await this.deviceService.revokeDevice(req.user.userId, deviceId);
  }

  @Put("/revoke/others")
  @ApiCreatedResponse({ description: "Other devices removed" })
  @ApiNotFoundResponse({ description: "No devices found" })
  @UseGuards(AccessGuard)
  async revokeOtherDevices(@Req() req: RequestDto) {
    return await this.deviceService.revokeOtherDevices(req.user);
  }
}
