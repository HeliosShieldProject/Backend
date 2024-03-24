import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeviceService } from "./device.service";
import { AddDeviceDto } from "./dto";

@Controller("device")
@ApiTags("device")
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: "Device created" })
  async addDevice(@Body() body: AddDeviceDto) {
    return await this.deviceService.addDevice(body);
  }
}
