import { Injectable } from '@nestjs/common';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import geoip from 'geoip-lite';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserDevices(id: string) {
    const devices = await this.devicesRepository.find({
      where: {
        user: {
          id: id,
        },
      },
      order: {
        registeredAt: 'DESC',
      },
    });

    return { all: devices, online: devices.filter((d) => d.isOnline) };
  }

  async createDevice(data: {
    ip: string;
    userId: string;
    userAgent: string;
    location?: string;
  }) {
    const user = await this.userRepository.findOne({
      where: {
        id: data.userId,
      },
    });
    if (!user) throw new Error('User not found');

    const deviceData = this.devicesRepository.create({
      ipAddress: data.ip,
      userAgent: data.userAgent,
      location: data.location,
      user,
    });

    const device = await this.devicesRepository.save(deviceData);

    return device;
  }

  async getUserDevice(opts: { userId: string; userAgent: string }) {
    const device = await this.devicesRepository.findOne({
      where: {
        userAgent: opts.userAgent,
        user: {
          id: opts.userId,
        },
      },
    });

    return device;
  }

  async setIsOnline(
    online: boolean,
    opts: { userId: string; userAgent: string },
  ) {
    const deviceExists = await this.devicesRepository.exists({
      where: {
        userAgent: opts.userAgent,
        user: {
          id: opts.userId,
        },
      },
    });

    if (!deviceExists) throw new Error('Device does not exist');

    await this.devicesRepository.update(
      {
        user: {
          id: opts.userId,
        },
        userAgent: opts.userAgent,
      },
      {
        isOnline: online,
        lastSeen: new Date(),
      },
    );
  }

  async registerDeviceConnection(opts: {
    userId: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
  }): Promise<Device> {
    const device = await this.devicesRepository.findOne({
      where: {
        userAgent: opts.userAgent,
        user: { id: opts.userId },
      },
    });
    if (!device) throw new Error('Device does not exist');

    await this.devicesRepository.update(
      {
        id: device.id,
      },
      {
        ipAddress: opts.ipAddress,
        userAgent: opts.userAgent,
        location: opts.location,
        lastSeen: new Date(),
        isOnline: true,
      },
    );

    return this.devicesRepository.findOne({
      where: {
        id: device.id,
      },
    });
  }
}
