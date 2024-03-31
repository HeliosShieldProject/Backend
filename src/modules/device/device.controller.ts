import { ParseUserPipe } from "@/common/pipes";
import { ParseDevicePipe } from "@/common/pipes/parse-device-pipe";
import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UUID } from "crypto";
import { DeviceService } from "./device.service";
import { AddDeviceDto } from "./dto";

@Controller("device")
@ApiTags("device")
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post("/:userId")
  @ApiCreatedResponse({ description: "Device created" })
  @ApiNotFoundResponse({ description: "User not found" })
  async addDevice(
    @Param("userId", ParseUserPipe) userId: UUID,
    @Body() body: AddDeviceDto,
  ) {
    return await this.deviceService.addDevice(userId, body);
  }

  @Put("/:deviceId")
  @ApiCreatedResponse({ description: "Device removed" })
  @ApiNotFoundResponse({ description: "Device or User not found" })
  async removeDevice(@Param("deviceId", ParseDevicePipe) deviceId: UUID) {
    return await this.deviceService.removeDevice(deviceId);
  }
}
