import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMember, Room } from '.';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  message: string;

  @ManyToOne(() => Room, (room) => room.id)
  room: Room;

  @OneToMany(() => ChatMember, (chatConnection) => chatConnection.id)
  @JoinColumn()
  sender: ChatMember;

  @Column('timestamp')
  time: number;
}
