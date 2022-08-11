
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { user } from './users.entity';

@Entity('matchs')
export class match extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    matchId: string;

    @OneToMany(() => user, (usr) => usr.userUuid)
    user1: user;

    @Column('smallint')
    score1: number;

    @OneToMany(() => user, (usr) => usr.userUuid)
    user2: user;

    @Column('smallint')
    score2: number;

    @OneToMany(() => user, (usr) => usr.userUuid)
    viewers: user[];

}