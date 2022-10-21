
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('users')
export class user extends BaseEntity {

    @ApiProperty({ description: 'The uuid of the user'})
    @PrimaryGeneratedColumn("uuid")
    userUuid: string;

    @ApiProperty({ example: '75410', description: '42s user unique ID'})
    @Column('varchar')
    user42Id: string;

    @ApiProperty({ example: 'ehautefa', description: 'The unique username (between 4 and 8 char)'})
    @Column('varchar')
    userName: string;

    @ApiProperty({ example: 'false', description: 'true if user is online'})
    @Column('boolean')
    online: boolean;

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

    @ApiProperty({ description: 'The list of user who are in pending request'})
    @ManyToMany(() => user, usr => usr.userUuid)
    @JoinTable()
    requestPending: user[];

    @ApiProperty({ description: 'The list of user who are blocked by the user'})
    @ManyToMany(() => user, usr => usr.userUuid)
    @JoinTable()
    blocked: user[];

    @ApiProperty({ example: 'false', description: 'The two factor authentication boolean'})
    @Column('boolean')
    twoFactorAuth: boolean;

    //to select = NULL
    @ApiProperty({ example: 'fgdldsfggfdgdg;dkg;djhgjdfg;d;g', description: 'secret for 2fa'})
    @Column('varchar')
    twoFactorAuthenticationSecret: string

    //to select = NULL
    @ApiProperty({ example: 'fgdldsfggfdgdg;dkg;djhgjdfg;d;g', description: 'secret for refresh token'})
    @Column({
        type: 'varchar',
        nullable: true,
        select: false,
    })
    currentHashedRefreshToken: string



    // match_history

}