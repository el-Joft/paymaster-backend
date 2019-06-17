import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column()
  public name: string;
  @OneToMany(() => User, (user: User) => user.role)
  public users: User[];
}
