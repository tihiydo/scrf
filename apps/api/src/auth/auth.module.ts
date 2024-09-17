import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from './entities/auth-token.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthTokenService } from './services/auth-token.service';
import { JwtService } from './services/jwt.service';
import { AuthService } from './services/auth.service';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthToken, User]), UserModule, ListsModule],
  controllers: [AuthController],
  providers: [JwtService, UserService, AuthTokenService, AuthService],
  exports: [TypeOrmModule, JwtService],
})
export class AuthModule {}
