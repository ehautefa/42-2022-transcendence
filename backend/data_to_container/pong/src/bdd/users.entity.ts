
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm'

@Entity('users')
export class user extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    userUuid: string;

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

    @ManyToMany(() => user, usr => usr.userUuid)
    @JoinTable()
    friends: user[];


    // @Column()

    // match_history


}