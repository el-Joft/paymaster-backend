import * as bcrypt from 'bcryptjs';
import {
  BaseEntity, BeforeInsert,
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from './role.entity';
@Entity()
export class User extends BaseEntity{

  @Column({ nullable: true })
  public address: string;

  @Column({ nullable: true })
  public businessName: string;

  @Column({ nullable: true })
  public cac: string;

  @CreateDateColumn() public created: Date;

  @Column({ nullable: true })
  public designation: string;

  @Column({
    nullable: true,
    unique: true,
  })
  public email: string;

  @Column({ name: 'first_name', length: 30, nullable: true })
  public firstName: string;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ default: false })
  public isActive: boolean;

  @Column({ default: false })
  public isAgentApproved: boolean;

  @Column({ default: false })
  public isEmailVerified: boolean;

  @Column({ nullable: true })
  public landmark: string;

  @Column({ name: 'last_name', length: 30, nullable: true })
  public lastName: string;

  @Column({ nullable: true })
  public lga: string;

  @Column({ nullable: true })
  public mobileNumber: string;

  @Column({ default: false })
  public outlet: boolean;

  @Column({ nullable: true })
  public password: string;

  @Column({ default: false })
  public requestAgent: boolean;

  @ManyToOne(() => Role, (role: Role) => role.users)
  public role: Role;

  @Column({ nullable: true })
  public state: string;

  @Column({ nullable: true })
  public telephone: string;

  @Column({ nullable: true })
  public token: string;

  @Column({ default: false })
  public tradingCapital: boolean;

  @UpdateDateColumn()
  public updated: Date;

  @Column({ nullable: true })
  public website: string;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    const nodeEnv: string = process.env.SALT as string;
    this.password = await bcrypt.hash(this.password, parseInt(nodeEnv, 10));
  }

  public toResponseObject(showToken: boolean, message: any): any {
    delete this.password;
    delete this.token;
    const responseObject: any = {
      ...this,
      message,
    };
    if (showToken) {
      responseObject.token = this.token;
    }
    if (this.role) {
      responseObject.role = this.role;
    }

    return responseObject;
  }
}
