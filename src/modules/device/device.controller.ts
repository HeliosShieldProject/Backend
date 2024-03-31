import { RequestDto } from "@/auth/dto";
import { AccessGuard } from "@/common/guards";
import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DeviceService } from "./device.service";
import { AddDeviceDto } from "./dto";

@Controller("device")
@ApiTags("device")
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiCreatedResponse({ description: "Device created" })
  @ApiNotFoundResponse({ description: "User not found" })
  @UseGuards(AccessGuard)
  async addDevice(@Req() req: RequestDto, @Body() body: AddDeviceDto) {
    return await this.deviceService.addDevice(req.user.userId, body);
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
