import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

export const AuthTokenValueType = {
  Long: 'long',
  Short: 'short',
} as const;
export type AuthTokenValueType = ObjectValues<typeof AuthTokenValueType>;

export const AuthTokenScope = {
  EmailVerification: 'email-verification',
  PasswordReset: 'password-reset',
} as const;
export type AuthTokenScope = ObjectValues<typeof AuthTokenScope>;

@Entity({ name: 'auth-tokens' })
@Unique(['scope', 'email'])
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text' })
  scope: AuthTokenScope;

  @Column({ type: 'text' })
  email: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expiresAt: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  usedAt?: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  usedBy?: string;
}
