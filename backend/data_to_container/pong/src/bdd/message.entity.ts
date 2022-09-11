import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';
import { user } from './users.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  message: string;

  @OneToMany(() => Room, (room) => room.id)
  room: Room;

  @OneToMany(() => user, (user) => user.userUuid)
  sender: user;

  @Column('timestamp')
  time: string;
}
