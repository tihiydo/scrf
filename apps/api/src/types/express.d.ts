import type { JWTPayload } from 'src/auth/schemas';
declare module 'express' {
  interface Request {
    user?: JWTPayload;
  }
}
