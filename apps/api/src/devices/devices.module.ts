import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { DeviceGateway } from './device.gateway';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Device } from './entities/device.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule, TypeOrmModule.forFeature([User, Device])],
  providers: [DevicesService, DeviceGateway],
  controllers: [DevicesController],
  exports: [TypeOrmModule],
})
export class DevicesModule {}
