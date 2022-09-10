import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { user } from './users.entity';

enum RoomType {
  Public,
  Private,
  Protected,
}

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar')
  name?: string;

  @Column('varchar')
  @OneToMany(() => user, (user) => user.userUuid)
  owner: string;

  @Column('varchar')
  password?: string;

  @Column('smallint')
  type: RoomType;

  @Column('varchar')
  @OneToMany(() => user, (user) => user.userUuid)
  admin: string;

  @ManyToMany(() => user)
  @JoinTable()
  user_id: number;
}
