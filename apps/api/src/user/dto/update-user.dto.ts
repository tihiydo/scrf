import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Subscriptions } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  avatarUrl: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  userName: string;
}

export class UpdateUserSubscriptionDto {
  @IsNotEmpty()
  @IsEnum(Subscriptions)
  subscription: Subscriptions;
}
