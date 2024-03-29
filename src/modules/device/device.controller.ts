import { Body, Controller, Param, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UUID } from "crypto";
import { DeviceService } from "./device.service";
import { AddDeviceDto } from "./dto";
import { ParseUserPipe } from "./pipes/parse-user-pipe";

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
}
