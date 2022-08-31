
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { user } from './users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('matchs')
export class match extends BaseEntity {

    @ApiProperty({ description: 'The id of the match'})
    @PrimaryGeneratedColumn("uuid")
    matchId: string;

    @ApiProperty({ description: 'The first player' })
    @ManyToOne(() => user, (usr) => usr.userName)
    user1: user;

    @ApiProperty({ example: 0, description: 'Score of the first player' })
    @Column('smallint')
    score1: number;

    @ApiProperty({ description: 'The second player' })
    @ManyToOne(() => user, (usr) => usr.userName)
    user2: user;

    @ApiProperty({ example: 0, description: 'Score of the second player' })
    @Column('smallint')
    score2: number;
}