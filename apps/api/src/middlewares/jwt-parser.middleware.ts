import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { JWTPayloadSchema } from 'src/auth/schemas';

@Injectable()
export class JwtParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.baseUrl.startsWith('/api/auth')) {
      const authHeader = req.cookies['jwt-access-token'];
      if (authHeader) {
        try {
          const decoded = verify(authHeader, process.env.JWT_ACCESS_SECRET);
          const payload = JWTPayloadSchema.parse(decoded);
          req['user'] = payload;
        } catch (err) {
          try {
            if (err?.message == 'jwt expired') {
              const refreshToken = verify(
                req.cookies['jwt-refresh-token'],
                process.env.JWT_REFRESH_SECRET,
              );

              if (refreshToken) {
                const payload = JWTPayloadSchema.parse(refreshToken);
                const accessToken = sign(
                  payload,
                  process.env.JWT_ACCESS_SECRET,
                  {
                    expiresIn: '3m',
                  },
                );

                res.cookie('jwt-access-token', accessToken);
                req['user'] = payload;
              } else {
                res.clearCookie('jwt-access-token');
                res.clearCookie('jwt-refresh-token');
              }
            }
          } catch (error) {
            console.log('error hanling jwt expirety', error);
          }
        }
      }
    }

    next();
  }
}
