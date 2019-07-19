import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

import { ServicesEntity } from './services.entity';

@Entity()
export class ServiceCategoryEntity extends BaseEntity {
  @CreateDateColumn() public created: Date;
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column({
    unique: true,
  })
  public name: string;

  @OneToMany(() => ServicesEntity, (services: ServicesEntity) => services.serviceCategory)
  public services: ServicesEntity[];

  @UpdateDateColumn()
  public updated: Date;
}
