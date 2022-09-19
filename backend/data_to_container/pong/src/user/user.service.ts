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
        if (!userUuid)
            return null;
        const user = await this.UserRepository.findOne({ where: { userUuid: userUuid } });
        return user;
    }

    async FindOrCreateUser(userToFindOrCreate: FindOrCreateUserDto): Promise<user> {
        const user = await this.UserRepository.findOne({ where: { user42Id: userToFindOrCreate.user42Id } })
        if (user)
            return user;
        else {
            let numberToAdd: number = 1;
            let uniqueUserName: string = userToFindOrCreate.userName;
            while (numberToAdd < 60) {
                if (await this.UserRepository.findOne({ where: { userName: uniqueUserName } }))
                    numberToAdd++;
                else
                    break

                uniqueUserName = userToFindOrCreate.userName + numberToAdd;
            }

            return await this.UserRepository.save({
                userName: uniqueUserName,
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

        if (await this.UserRepository.findOne({ where: { userName: userToChange.newName } })) {
            console.log("Error username already exist");
            return null;
        }
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