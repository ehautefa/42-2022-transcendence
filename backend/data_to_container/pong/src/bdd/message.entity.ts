import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';
import { user } from './users.entity';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Room, (room) => room.id)
  room: Room;

  @OneToMany(() => user, (user) => user.userUuid)
  sender: user;

  @Column('timestamp')
  time: string;
}
