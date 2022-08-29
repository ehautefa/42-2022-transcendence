
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { user } from './users.entity';

@Entity('matchs')
export class match extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    matchId: string;

    @ManyToOne(() => user, (usr) => usr.userUuid)
    user1: user;

    @Column('smallint')
    score1: number;

    @ManyToOne(() => user, (usr) => usr.userUuid)
    user2: user;

    @Column('smallint')
    score2: number;
}