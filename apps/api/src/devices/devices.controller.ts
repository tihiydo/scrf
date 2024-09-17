import { Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { Roles } from 'decorators/roles.decorator';
import { Request } from 'express';

@Controller('devices')
export class DevicesController {
  constructor(private readonly deviceService: DevicesService) {}

  @Get('/')
  @Roles('logged-in-only')
  async getMyDevices(@Req() request: Request) {
    const userId = request.user.id;
    const devices = await this.deviceService.getUserDevices(userId);

    return {
      devices: devices.all,
    };
  }

  @Delete('/:id')
  async deleteDevice(@Param('id') id: string) {}
}
