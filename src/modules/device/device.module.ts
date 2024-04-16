import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";

@Module({
  providers: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
