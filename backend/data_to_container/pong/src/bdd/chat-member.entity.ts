import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message, Room, user } from '.';

@Entity()
export class ChatMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => user, (usr) => usr.userUuid, { onDelete: 'CASCADE' })
  user: user;

  @ManyToOne(() => Room, (room) => room.members, { onDelete: 'CASCADE' })
  room: Room;

  @OneToMany(() => Message, (msg) => msg.sender)
  messages: Message[];

  @Column('timestamp', { nullable: true })
  bannedTime: number;

  @Column('timestamp', { nullable: true })
  mutedTime: number;

  @Column('boolean', { default: false })
  isAdmin: boolean;
}
