import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/entities/user.entity';

export const Roles = Reflector.createDecorator<
  UserRole[] | 'logged-in-only' | 'everyone'
>();
