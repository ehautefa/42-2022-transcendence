import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from 'src/bdd/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ChangeUserNameDto } from './dto/changeUserName.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EndOfMatchDto } from './dto/endOfMatch.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(user) private UserRepository: Repository<user>
    ) { }

    async getAllUser(): Promise<user[]> {
        return await this.UserRepository.find({});
    }

    async getUser(userUuid: string): Promise<user> {
        return await this.UserRepository.findOne({ where: {userUuid: userUuid} });
    }

    async createUser(userToCreate: CreateUserDto): Promise<user> {
        return await this.UserRepository.save({
            userName: userToCreate.userName,
            userPassword: userToCreate.userPassword,
            twoFfactorAuth: false,
            wins: 0,
            losses: 0,
        });
    }

    async changeUserName(userToChange: ChangeUserNameDto): Promise<void> {
        //need check if userName already exist
        await this.UserRepository.update(userToChange.userUuid, { userName: userToChange.newName });
    }

    async endOfMatch(players: EndOfMatchDto) : Promise<void> {
        await this.UserRepository.increment({ userUuid: players.loserUuid }, "losses", 1)
        await this.UserRepository.increment({ userUuid: players.winnerUuid }, "wins", 1)
    }
}