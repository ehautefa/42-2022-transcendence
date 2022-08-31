
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm'

@Entity('users')
export class user extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    userUuid: string;

    @Column('varchar')
    userName42: string;

    @Column('varchar')
    userName: string;

    @Column('varchar')
    userPassword: string;

    @Column('boolean')
    twoFactorAuth: boolean;

    @Column('smallint')
    wins: number;

    @Column('smallint')
    losses: number;

    @Column('varchar')
    accessToken42: string;

    @ManyToMany(() => user, usr => usr.userUuid)
    @JoinTable()
    friends: user[];

    // match_history


}