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

  @CreateDateColumn() public created: Date;

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
  public isEmailVerified: boolean;

  @Column({ name: 'last_name', length: 30, nullable: true })
  public lastName: string;

  @Column({ nullable: true })
  public mobileNumber: string;

  @Column({ nullable: true })
  public password: string;

  @ManyToOne(() => Role, (role: Role) => role.users)
  public role: Role;

  @Column({ nullable: true })
  public token: string;

  @UpdateDateColumn()
  public updated: Date;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    const nodeEnv: string = process.env.SALT as string;
    this.password = await bcrypt.hash(this.password, parseInt(nodeEnv, 10));
  }

  public toResponseObject(showToken: boolean, message: any): any {
    delete this.password;
    const {
      id,
      created,
      email,
      firstName,
      lastName,
      mobileNumber,
      token,
    }: any = this;
    const responseObject: any = {
      created,
      email,
      firstName,
      id,
      lastName,
      message,
      mobileNumber,
    };
    if (showToken) {
      responseObject.token = token;
    }
    if (this.role) {
      responseObject.role = this.role;
    }

    return responseObject;
  }
}
