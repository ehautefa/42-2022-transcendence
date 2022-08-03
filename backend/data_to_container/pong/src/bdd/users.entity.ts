
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm'

@Entity('users')
export class user extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column('varchar')
    userName: string;

    @Column('boolean')
    twoFfactorAuth: boolean;


    @Column('smallint')
    wins: number;

    @Column('smallint')
    losses: number;

    @ManyToMany(() => user, usr => usr.friends)
    @JoinTable()
    friends: user[];


    // @Column()
    // match_history


}