import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Ip,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { UserService } from 'src/user/user.service';
import * as sha256 from 'sha256';
import { removeKeysFromObject } from 'src/utils';
import { Request, Response } from 'express';
import { JWT_ACCESS_KEY, JWT_REFRESH_KEY } from './constants';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { RequestVerifTokenDto } from './dto/request-verif-token.dto';
import { verify as verifyJWT } from 'jsonwebtoken';
import { JWTPayloadSchema } from './schemas';
import { AuthTokenService } from './services/auth-token.service';
import {
  AuthTokenScope,
  AuthTokenValueType,
} from './entities/auth-token.entity';
import { JwtService } from './services/jwt.service';
import { AuthService } from './services/auth.service';
import { CheckTokenDto } from './dto/check-token.dto';
import { AdminRole, UserRole } from 'src/user/entities/user.entity';

@Controller('auth')
@UsePipes(ZodValidationPipe)
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,

    private readonly authTokenService: AuthTokenService,

    private readonly authService: AuthService,

    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.getUserBy({ email: body.email });
    if (!user) {
      throw new NotFoundException('User not registered');
    }

    const hashedPassword = sha256(body.password);

    if (hashedPassword !== user.hashedPassword) {
      throw new BadRequestException('Wrong Password');
    }

    if (!user.verified) {
      const authToken = await this.authTokenService.generateToken({
        email: user.email,
        duration: 1000 * 60 * 5,
        scope: AuthTokenScope.EmailVerification,
        valueType: body.verification?.tokenType ?? AuthTokenValueType.Long,
      });

      await this.authTokenService.sendVerificationEmail(authToken);

      throw new BadRequestException(
        'You are not verified. We have sent you an email to repeat verification',
        { cause: 'login-unverified' },
      );
    }

    const tokens = this.jwtService.generateTokens({
      id: user.id,
      role: user.role,
    });

    res.cookie(JWT_ACCESS_KEY, tokens.accessToken);
    res.cookie(JWT_REFRESH_KEY, tokens.refreshToken, {
      httpOnly: true,
    });

    return {
      user: removeKeysFromObject(user, ['hashedPassword']),
      accessToken: tokens.accessToken,
    };
  }

  @Post('admin-login')
  async adminLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.getUserBy({
      email: loginDto.email,
    });
    if (!user) {
      throw new NotFoundException('User not registered');
    }

    if (!Object.values(AdminRole).includes(user.role as any)) {
      throw new BadRequestException('User is not Admin');
    }

    const hashedPassword = sha256(loginDto.password);

    if (hashedPassword !== user.hashedPassword) {
      throw new BadRequestException('Wrong Password');
    }

    const tokens = this.jwtService.generateTokens({
      id: user.id,
      role: user.role,
    });

    res.cookie(JWT_ACCESS_KEY, tokens.accessToken);
    res.cookie(JWT_REFRESH_KEY, tokens.refreshToken, {
      httpOnly: true,
    });

    return {
      user: removeKeysFromObject(user, ['hashedPassword']),
      accessToken: tokens.accessToken,
    };
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const existingUser = await this.userService.getUserBy({
      email: body.email,
    });
    if (existingUser) {
      throw new BadRequestException('User with such email already registered');
    }

    const user = await this.userService.create({
      email: body.email,
      password: body.password,
    });

    const tokens = this.jwtService.generateTokens({
      id: user.id,
      role: user.role,
    });

    res.cookie(JWT_ACCESS_KEY, tokens.accessToken);
    res.cookie(JWT_REFRESH_KEY, tokens.refreshToken, {
      httpOnly: true,
    });

    const authToken = await this.authTokenService.generateToken({
      email: user.email,
      duration: 1000 * 60 * 5,
      scope: AuthTokenScope.EmailVerification,
      valueType: body.verification?.tokenType ?? AuthTokenValueType.Long,
    });

    await this.authTokenService.sendVerificationEmail(authToken);

    return {
      user,
      accessToken: tokens.accessToken,
    };
  }

  @Post('request-verif-token')
  async requestVerificationToken(
    @Body() requestVerifTokenDto: RequestVerifTokenDto,
  ) {
    if (!requestVerifTokenDto) {
      throw new BadRequestException();
    }

    const token = await this.authTokenService.getToken({
      email: requestVerifTokenDto.email,
    });

    if (!token) {
      throw new NotFoundException(
        'Verification token for your email could not be found',
      );
    }

    const user = await this.userService.getUserBy({
      email: token.email,
    });
    if (user?.verified) {
      throw new BadRequestException('User already verified');
    }

    await this.authTokenService.sendVerificationEmail(token);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[JWT_REFRESH_KEY];
    if (!refreshToken) throw new UnauthorizedException('Refresh not found');

    try {
      const jwtPayload = verifyJWT(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
      const parsedJwtPayload = JWTPayloadSchema.parse(jwtPayload);
      const token = this.jwtService.generateAccessToken(parsedJwtPayload);

      const __dangerousUser = await this.userService.getUserBy({
        id: parsedJwtPayload.id,
      });
      const dbUser = removeKeysFromObject(__dangerousUser, ['hashedPassword']);
      res.cookie(JWT_ACCESS_KEY, token);
      return dbUser;
    } catch (err: any) {
      if (err?.message == 'jwt expired') {
        res.clearCookie(JWT_ACCESS_KEY);
        res.clearCookie(JWT_REFRESH_KEY);
        throw new UnauthorizedException('Refresh is expired');
      }
    }
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(JWT_REFRESH_KEY);
    res.clearCookie(JWT_ACCESS_KEY);
  }

  @Post('/check-token')
  async checkToken(@Body() body: CheckTokenDto) {
    await this.authTokenService.verifyToken({
      email: body.email,
      scope: body.scope,
      tokenValue: body.token,
    });

    return 'valid';
  }

  @Post('/verify/:token')
  async verifyUser(@Param('token') token: string, @Ip() ip: string) {
    const dbToken = await this.authTokenService.getToken({ value: token });
    if (!dbToken) {
      throw new BadRequestException('Invalid token');
    }
    const user = await this.userService.getUserBy({ email: dbToken.email });

    if (!user.verified) {
      await this.authTokenService.verifyToken({
        email: dbToken.email,
        scope: AuthTokenScope.EmailVerification,
        tokenValue: dbToken.value,
      });
      const verifiedUser = await this.userService.verify(user.email);
      await this.authTokenService.useToken({
        ip: ip,
        email: dbToken.email,
        scope: AuthTokenScope.EmailVerification,
        tokenValue: dbToken.value,
      });
      return verifiedUser;
    }

    return user;
  }
  //dd
  @Post('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordDto,
  ) {
    const dbToken = await this.authTokenService.getToken({ value: token });
    await this.authTokenService.verifyToken({
      email: dbToken.email,
      scope: AuthTokenScope.PasswordReset,
      tokenValue: dbToken.value,
    });

    await this.userService.updatePassword(dbToken.email, body.password);
  }

  @Post('/request-reset-password')
  async requestResetPassword(@Body() body: RequestResetPasswordDto) {
    const token = await this.authTokenService.generateToken({
      email: body.email,
      duration: 1000 * 60 * 5,
      scope: AuthTokenScope.PasswordReset,
      valueType: body.valueType,
    });

    await this.authTokenService.sendChangePasswordEmail({
      isChange: body.isChange,
      token: token,
    });
  }
}
