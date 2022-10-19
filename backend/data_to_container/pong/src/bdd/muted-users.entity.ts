/*
@Entity('mutedUsers')
export class MutedUsers {
  @OneToMany(() => user, (user) => user.userUuid)
  user: user;

  @OneToMany(() => Room, (room) => room.id)
  room: Room;

  @Column('timestamp')
  timestamp: Date;
}
*/
