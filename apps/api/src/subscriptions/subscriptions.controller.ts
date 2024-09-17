import { Controller, Get, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Roles } from 'decorators/roles.decorator';
import { Request } from 'express';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('/history')
  @Roles('logged-in-only')
  async getSubscriptionHistory(@Req() req: Request) {
    const user = req.user!;

    const history = await this.subscriptionsService.getUserHistory(user.id);

    return {
      history: history ?? [],
    };
  }

  @Get('/can-buy-free')
  async canbuyfree(@Req() req: Request) {
    return await this.subscriptionsService.canBuyFree(req.user.id);
  }
}
