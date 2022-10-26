import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMember } from '.';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  message: string;

  @OneToMany(() => ChatMember, (chatConnection) => chatConnection.id)
  sender: ChatMember;

  @Column('timestamp')
  time: Date;
}
