import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMember } from './';

export enum RoomType {
  PRIVATE = 'private',
  PUBLIC = 'public',
  DM = 'dm',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  name: string;

  // A DM room does not have an owner
  @OneToOne(() => ChatMember, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  owner: ChatMember;

  @Column({
    type: 'boolean',
    default: false,
  })
  isProtected: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  hash: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.PUBLIC,
  })
  type: RoomType;

  @OneToMany(() => ChatMember, (chatMember) => chatMember.room)
  @JoinColumn()
  members: ChatMember[];
}
