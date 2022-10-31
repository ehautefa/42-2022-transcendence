import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMember } from '.';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  message: string;

  @ManyToOne(() => ChatMember, (chatConnection) => chatConnection.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  sender: ChatMember;

  @Column('timestamp')
  time: Date;
}
