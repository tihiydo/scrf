import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  AuthToken,
  AuthTokenScope,
  AuthTokenValueType,
} from '../entities/auth-token.entity';
import { generate as otpGenerator } from 'otp-generator';
import { verificationEmail } from '../emails/verification-email';
import { generateMailOptions, transporter } from 'src/lib/nodemailer';
import resetPasswordEmail from '../emails/reset-password-email';
import { generate as generatePassword } from 'generate-password';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(AuthToken)
    private readonly authTokensRepository: Repository<AuthToken>,
  ) { }

  async sendVerificationEmail(token: AuthToken) {
    if (token.scope !== AuthTokenScope.EmailVerification) {
      throw new BadRequestException('Inappropriate token scope');
    }

    const html = verificationEmail({
      token: token.value,
      tokenValueType: this.getTokenValueType(token.value),
    });

    const mailOptions = generateMailOptions(
      [token.email],
      `Screenify | Account Verification`,
      html,
    );

    return await transporter.sendMail(mailOptions);
  }

  async sendChangePasswordEmail(args: { token: AuthToken; isChange: boolean }) {
    if (args.token.scope !== AuthTokenScope.PasswordReset) {
      throw new BadRequestException('Inappropriate token scope');
    }

    const html = resetPasswordEmail({
      token: args.token.value,
      isChange: args.isChange,
      tokenValueType: this.getTokenValueType(args.token.value),
    });
    const mailOptions = generateMailOptions(
      [args.token.email],
      `Screenify | Reset password`,
      html,
    );

    return await transporter.sendMail(mailOptions);
  }

  async getToken(options: FindOptionsWhere<AuthToken>) {
    return await this.authTokensRepository.findOne({
      where: options,
    });
  }

  async generateToken(args: {
    email: string;
    scope: AuthTokenScope;
    valueType: AuthTokenValueType;
    duration?: number;
  }): Promise<AuthToken> {
    const user = await this.usersRepository.findOne({
      where: {
        email: args.email,
      },
      select: ['id'],
    });

    if (!user) {
      throw new NotFoundException('User with this email was not found');
    }

    const existingAuthToken = await this.authTokensRepository.findOne({
      where: {
        email: args.email,
        scope: args.scope,
      },
    });

    const tokenValue = this.generateRandomToken(args.valueType);
    const duration = args.duration ?? 10 * 60 * 1000;
    const expiresAt = new Date(Date.now() + duration);
    let authTokenEntity: AuthToken | null = null;

    if (existingAuthToken) {
      await this.authTokensRepository.update(
        {
          email: args.email,
          scope: args.scope,
        },
        {
          value: tokenValue,
          expiresAt,
          usedAt: null,
          usedBy: null,
        },
      );

      authTokenEntity = await this.authTokensRepository.findOne({
        where: {
          email: args.email,
          scope: args.scope,
        },
      });
    } else {
      const authTokenEntityData = this.authTokensRepository.create({
        value: tokenValue,
        email: args.email,
        expiresAt: expiresAt,
        scope: args.scope,
      });

      authTokenEntity =
        await this.authTokensRepository.save(authTokenEntityData);
    }

    if (!authTokenEntity) {
      throw new InternalServerErrorException('Could not generate token');
    }

    return authTokenEntity;
  }

  async verifyToken(args: {
    email: string;
    tokenValue: string;
    scope: AuthTokenScope;
  }): Promise<true> {
    const authTokenEntity = await this.authTokensRepository.findOne({
      where: {
        email: args.email,
        value: args.tokenValue,
        scope: args.scope,
      },
    });

    if (!authTokenEntity) {
      throw new BadRequestException('Invalid token');
    }

    if (authTokenEntity.usedAt) {
      throw new BadRequestException('Token has already been used');
    }

    const expirationTime = authTokenEntity.expiresAt.getTime();

    if (expirationTime < Date.now()) {
      throw new BadRequestException('Token expired');
    }

    return true;
  }

  async useToken(args: {
    ip?: string;
    email: string;
    tokenValue: string;
    scope: AuthTokenScope;
  }) {
    const authToken = await this.authTokensRepository.findOne({
      where: {
        scope: args.scope,
        value: args.tokenValue,
      },
    });

    if (!authToken) {
      throw new BadRequestException('Invalid token');
    }

    if (authToken.usedAt) {
      throw new BadRequestException('Token has been already used');
    }

    return this.authTokensRepository.update(
      {
        value: args.tokenValue,
        email: args.email,
        scope: args.scope,
      },
      {
        usedAt: new Date(),
        usedBy: args.ip,
      },
    );
  }

  private generateRandomToken(type: AuthTokenValueType): string {
    if (type === AuthTokenValueType.Short) {
      return otpGenerator(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
    } else if (type === AuthTokenValueType.Long) {
      return generatePassword({
        length: 12,
      });
    }
  }

  private getTokenValueType(token: string): AuthTokenValueType {
    if (token.length <= 6) {
      return AuthTokenValueType.Short;
    } else {
      return AuthTokenValueType.Long;
    }
  }
}
