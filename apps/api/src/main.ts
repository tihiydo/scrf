import * as cookieParser from 'cookie-parser';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';

export const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: process.env.WEB_CLIENT_URL,
  });
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  app.useStaticAssets(join(__dirname, '../..', 'uploads'), {
    prefix: '/api/uploads/',
  });
  app.use(cookieParser());
  app.useGlobalGuards(new RolesGuard(reflector)); 
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(5001);
}
bootstrap();
