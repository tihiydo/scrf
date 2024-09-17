import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  Patch,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { removeKeysFromObject } from 'src/utils';
import { Roles } from 'decorators/roles.decorator';
import { AdminRole, Subscriptions, UserRole } from './entities/user.entity';
import {
  UpdateUserDto,
  UpdateUserSubscriptionDto,
} from './dto/update-user.dto';
import { Request } from 'express';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { In, Not } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly subscriptionsService: SubscriptionsService,
  ) { }

  @Get('/me')
  @Roles('logged-in-only')
  async getMyUser(@Req() req: Request) {
    const __dangerousUser = await this.userService.getUserBy({
      id: req?.user.id,
    });
    const dbUser = removeKeysFromObject(__dangerousUser, ['hashedPassword']);
    return dbUser;
  }

  @Get('/moderation')
  @Roles([UserRole.Admin, UserRole.SalesTeam])
  async adminGetUsers() {
    const users = await this.userService.getUsers({
      order: {
        createdAt: {
          direction: 'desc',
        },
      },
      where: {
        role: Not(In(Object.values(AdminRole))),
      },
    });

    return users.map((user) => {
      return removeKeysFromObject(user, ['hashedPassword']);
    });
  }

  @Delete('/me')
  @Roles(['User'])
  async deleteUser(@Req() req: Request) {
    const id = req.user.id;


    await this.userService.deleteUser(id);
  }

  @Post('/ban-toggle/:id')
  @Roles([UserRole.Admin, UserRole.SalesTeam])
  async toggleBanUser(@Param('id') id: string) {
    const user = await this.userService.toggleBanUser(id);
    return user;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const __dangerousUser = await this.userService.getUserBy({
      id: id,
    });
    const dbUser = removeKeysFromObject(__dangerousUser, ['hashedPassword']);
    return dbUser;
  }

  @Patch('/update-subscription/:id')
  @Roles([UserRole.User])
  async updateSubscription(
    @Body() body: UpdateUserSubscriptionDto,
    @Param('id') id: string,
  ) {
    if (Subscriptions[body.subscription]) {
      const canbuyfree = await this.subscriptionsService.canBuyFree(id);
      console.warn('test', canbuyfree);
      if (!canbuyfree) {
        await this.subscriptionsService.createHistoryItem({
          price: body.subscription + 1,
          subscriptionType: body.subscription,
          userId: id,
        });
        await this.userService.updateSubscription(body.subscription, id);
        return true;
      } else {
        await this.subscriptionsService.createHistoryItem({
          price: 0,
          subscriptionType: body.subscription,
          userId: id,
        });
        await this.userService.updateSubscription(body.subscription, id);
        await this.userService.approveUserSubscription(id, true);
        return true;
      }
    }
    throw new HttpException(
      'This subscription does not exist',
      HttpStatus.BAD_REQUEST,
    );
  }

  @Patch('/update-user/:id')
  async updateUser(@Body() body: UpdateUserDto, @Param('id') id: string) {
    return this.userService.updateUser(body, id);
  }

  @Patch('/approve-subscription/:id')
  @Roles([UserRole.Admin, UserRole.SalesTeam])
  async approveUserSubscription(@Param('id') id: string) {
    const user = await this.userService.approveUserSubscription(id);
    return user;
  }

  @Patch('/decline-subscription/:id')
  async declineUserSubscription(@Param('id') id: string, @Req() req: Request) {
    const user = await this.userService.declineUserSubscription(id);
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
