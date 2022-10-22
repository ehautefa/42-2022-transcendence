import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room, user } from '.';

@Entity()
export class ChatMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => user, (usr) => usr.userUuid, { onDelete: 'CASCADE' })
  user: user;

  @ManyToOne(() => Room, (room) => room.id, { onDelete: 'CASCADE' })
  room: Room;

  @Column('timestamp', { nullable: true })
  bannedTime: number;

  @Column('timestamp', { nullable: true })
  mutedTime: number;

  @Column('boolean', { default: false })
  isAdmin: boolean;
}
