import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMember } from '.';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  message: string;

  // @ManyToOne(() => Room, (room) => room.id)
  // room: Room;

  @OneToMany(() => ChatMember, (chatConnection) => chatConnection.id)
  sender: ChatMember;

  @Column('timestamp')
  time: number;
}
