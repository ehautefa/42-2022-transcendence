import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { user } from './users.entity';

export enum RoomType {
  PRIVATE = 'private',
  PUBLIC = 'public',
  PROTECTED = 'protected',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: true })
  name: string;

  @OneToMany(() => user, (user) => user.userUuid, { nullable: true })
  owner: user;

  @Column('varchar', { nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.PROTECTED,
  })
  type: RoomType;

  @OneToMany(() => user, (user) => user.userUuid, { nullable: true })
  admin: user;

  @ManyToMany(() => user, (user) => user.userUuid)
  @JoinTable()
  users: user[];
}
