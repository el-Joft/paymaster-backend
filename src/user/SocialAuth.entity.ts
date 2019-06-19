import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class SocialAuth {

  @Column({ name: 'access_token', length: 500 })
  public accessToken: string;

  @Column({ type: Date, name: 'expires_at', nullable: true })
  public expiresAt: Date;

  @CreateDateColumn({ name: 'granted_at' })
  public grantedAt: Date;
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 20, nullable: true })
  public provider: string;

  @Column({ length: 200, nullable: true })
  public providerClientId: string;

  @Column({ name: 'refresh_token', length: 200, nullable: true })
  public refreshToken: string;

  @Column({ length: 512, nullable: true })
  public scope: string;

  @Column({ name: 'token_type', length: 200, nullable: true })
  public tokenType: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  public user: User;

}
