import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from 'src/bdd/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ChangeUserNameDto } from './dto/changeUserName.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EndOfMatchDto } from './dto/endOfMatch.dto';
import { FindOrCreateUserDto } from './dto/findOrCreate.dto';
import { FlipTwoFactorAuthDto } from './dto/flipTwoFactorAuyh.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(user) private UserRepository: Repository<user>
    ) { }

    async getAllUser(): Promise<user[]> {
        //need to remove access_token from the tab
        return await this.UserRepository.find({});
    }

    async getUser(userUuid: string): Promise<user> {
        return await this.UserRepository.findOne({ where: { userUuid: userUuid } });
    }

    // async createUser(userToCreate: CreateUserDto): Promise<user> {
        // console.log(userToCreate);
        // return await this.UserRepository.save({
            // userName: "todel",
            // user42Id: "todel",
            // accessToken42: "todel",
            // twoFactorAuth: false,
            // wins: 0,
            // losses: 0,
        // });
    // }
// 
    async FindOrCreateUser(userToFindOrCreate: FindOrCreateUserDto): Promise<user> {
        const user = await this.UserRepository.findOne({ where: { user42Id: userToFindOrCreate.user42Id } })
        if (user)
            return user;
        else {
            let extraName: string = '';
            if (await this.UserRepository.findOne({ where: { userName: userToFindOrCreate.userName } }))
                extraName = userToFindOrCreate.user42Id;

            return await this.UserRepository.save({
                userName: userToFindOrCreate.userName + extraName,
                user42Id: userToFindOrCreate.user42Id,
                accessToken42: userToFindOrCreate.accessToken42,
                online: false,
                twoFactorAuth: false,
                wins: 0,
                losses: 0,
            });
        }
    }

    async changeUserName(userToChange: ChangeUserNameDto): Promise<void> {
        //need check if userName already exist

        if (await this.UserRepository.findOne({ where: { userName: userToChange.newName } }))
            return console.log("Error username already exist");
        await this.UserRepository.update(userToChange.userUuid, { userName: userToChange.newName });
    }

    async flipTwoFactorAuth(userToChange: FlipTwoFactorAuthDto): Promise<void> {
        //await this.UserRepository.update(userToChange.userUuid, [{twoFactorAuth: }]);
    }

    async endOfMatch(players: EndOfMatchDto): Promise<void> {
        await this.UserRepository.increment({ userUuid: players.loserUuid }, "losses", 1)
        await this.UserRepository.increment({ userUuid: players.winnerUuid }, "wins", 1)
    }
}