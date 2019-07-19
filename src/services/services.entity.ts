import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

import { ServiceCategoryEntity } from './serviceCategory.entity';

@Entity()
export class ServicesEntity extends BaseEntity {
  @CreateDateColumn() public created: Date;
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column({
    unique: true,
  })
  public name: string;

  @ManyToOne(() => ServiceCategoryEntity, (
    serviceCategory: ServiceCategoryEntity) => serviceCategory.services)
  public serviceCategory: ServiceCategoryEntity;

  @UpdateDateColumn()
  public updated: Date;
}
