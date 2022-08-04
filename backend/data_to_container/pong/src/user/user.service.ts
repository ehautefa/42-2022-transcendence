import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from 'src/bdd/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { EndOfMatchDto } from './dto/endOfMatch.dto';
import { getUserDto } from './dto/getUser';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(user) private UserRepository: Repository<user>
    ) { }

    async getAllUser(): Promise<user[]> {
        return await this.UserRepository.find({});
    }

    async getUser(userUid: getUserDto): Promise<user> {
        return await this.UserRepository.findOne({ where: { userId: userUid.userUid } });
    }


    async createUser(userToCreate: CreateUserDto): Promise<user> {
        return await this.UserRepository.save({
            userName: userToCreate.userName,
            twoFfactorAuth: false,
            wins: 0,
            losses: 0,
        });
    }

    async endOfMatch(players: EndOfMatchDto) : Promise<void> {
        await this.UserRepository.increment({ userId: players.loserUid }, "losses", 1)
        await this.UserRepository.increment({ userId: players.winnerUid }, "wins", 1)
    }
}

    // async changeUserName(body) {
        // let tochange: user = await this.UserRepository.findOne({
            // where: {
                // userId: body.userId
            // }
        // })
        // tochange.userName = body.newName;
        // await tochange.save();
        // return tochange;
    // }