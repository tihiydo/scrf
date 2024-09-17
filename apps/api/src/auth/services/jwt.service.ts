import {
  sign as signJWT,
  verify as verifyJWT,
  JsonWebTokenError,
} from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayload, JWTPayloadSchema } from '../schemas';

@Injectable()
export class JwtService {
  generateTokens(payload: JWTPayload) {
    const accessToken = signJWT(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '5m',
    });
    const refreshToken = signJWT(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  parseAccessJwtPayload(accessToken: string): JWTPayload {
    const jwtPayload = verifyJWT(accessToken, process.env.JWT_ACCESS_SECRET);
    const parsedJwtPayload = JWTPayloadSchema.parse(jwtPayload);

    return parsedJwtPayload;
  }

  parseRefreshJwtPayload(refreshToken: string): JWTPayload {
    const jwtPayload = verifyJWT(refreshToken, process.env.JWT_REFRESH_SECRET);
    const parsedJwtPayload = JWTPayloadSchema.parse(jwtPayload);

    return parsedJwtPayload;
  }

  generateAccessToken(jwt: JWTPayload) {
    const accessToken = signJWT(jwt, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '1m',
    });
    return accessToken;
  }
}
