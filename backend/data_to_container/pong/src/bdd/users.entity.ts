
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('users')
export class user extends BaseEntity {

    @ApiProperty({ description: 'The uuid of the user'})
    @PrimaryGeneratedColumn("uuid")
    userUuid: string;

    @ApiProperty({ example: 'ehautefa', description: 'The unique username (between 4 and 8 char)'})
    @Column('varchar')
    userName42: string;

    @Column('varchar')
    userName: string;

    @ApiProperty({ description: 'The password of the user'})
    @Column('varchar')
    userPassword: string;

    @ApiProperty({ example: 'false', description: 'The two factor authentication boolean'})
    @Column('boolean')
    twoFactorAuth: boolean;

    @ApiProperty({ example: '0', description: 'The number of win of the user'})
    @Column('smallint')
    wins: number;

    @ApiProperty({ example: '0', description: 'The number of loose of the user'})
    @Column('smallint')
    losses: number;

    @ApiProperty({ description: 'The list of user who are friend with the user'})
    @ManyToMany(() => user, usr => usr.userUuid)
    @JoinTable()
    friends: user[];


    @ApiProperty({ description: 'The acces_token for api 42'})
    @Column('varchar')
    accessToken42: string;


    // match_history


}