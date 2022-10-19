import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { user } from './users.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  message: string;

  @ManyToOne(() => Room, (room) => room.id)
  room: Room;

  @OneToOne(() => user, (user) => user.userUuid)
  sender: user;

  @Column('timestamp')
  time: Date;
}
