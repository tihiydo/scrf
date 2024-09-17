import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'decorators/roles.decorator';
import { Request } from 'express';
import { UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user;
    if (!user?.role) return false;

    if (roles instanceof Array) {
      return roles.includes(user.role);
    }

    if (typeof roles === 'string') {
      if (roles === 'everyone') return true;

      if (roles === 'logged-in-only')
        return Object.values(UserRole).some((role) => role === user.role);
    }
  }
}
