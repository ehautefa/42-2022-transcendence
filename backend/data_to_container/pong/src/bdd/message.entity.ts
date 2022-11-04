import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMember } from '.';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  message: string;

  @ManyToOne(() => ChatMember, (chatMember) => chatMember.id, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  sender: ChatMember;

  @Column('timestamp')
  time: Date;
}
