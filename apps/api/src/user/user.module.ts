import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { ListsModule } from 'src/lists/lists.module';
import { List } from 'src/lists/entities/list.entity';

@Module({
  imports: [SubscriptionsModule, ListsModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UserModule {}
