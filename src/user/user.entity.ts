import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @Column()
  public firstName: string;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public isActive: boolean;

  @Column()
  public lastName: string;

}
