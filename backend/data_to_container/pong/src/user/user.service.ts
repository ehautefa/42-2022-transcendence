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
        return await this.UserRepository.find({ relations: { friends: true, blocked: true } });
    }

    async getAllUserUuidWithUserName() {
        return await this.UserRepository.find({ select: { userUuid: true, userName: true } });
    }

    async getFriends(userUuid: string) {
        const user = await this.getCompleteUser(userUuid);
        if (!user)
            return null;
        //need to throw
        return user.friends;
    }

    async isMyFriend(me: user, user2: user): Promise<boolean | null> {
        if (!me || !user2)
            return null
        //need to throw
        const idx1 = me.friends.findIndex((object) => {
            return object.userUuid === user2.userUuid;
        })
        if (idx1 > -1)
            return true;
        else
            return false;
    }

    async acceptFriendRequest(CompleteMe: user, CompleteUser2: user) {
        // cant find user
        if (!CompleteMe || CompleteUser2)
            return false

        let idx1: number = CompleteMe.requestPending.indexOf(CompleteUser2.userUuid)
        CompleteMe.requestPending.splice(idx1);
        let idx2 = CompleteUser2.requestPending.indexOf(CompleteMe.userUuid)
        CompleteUser2.requestPending.splice(idx2);
        await this.becomeFriend(CompleteMe, CompleteUser2);
    
    }

    async makeFriendRequest(completeMe: user, completeUser2: user) {
        // cant find user
        if (completeMe ||!completeUser2)
            return false

        // allready friends need to throw
        if (completeMe.friends.indexOf(completeUser2) > -1)
            return false

       const idx = completeUser2.requestPending.indexOf(completeMe.userUuid)
        //symeetrical request
        if (completeMe.requestPending.indexOf(completeUser2.userUuid) > -1) {
            if (idx > -1)
                completeUser2.requestPending.splice(idx);
            await this.becomeFriend(completeMe, completeUser2);
        }
        // already in pending?
        else if (idx < 0)
        {
            completeUser2.requestPending.push(completeMe.userUuid);
            this.UserRepository.save(completeUser2);
        }
    }

    //need to remove from blocked?
    async becomeFriend(completeUser1: user, completeUser2: user): Promise<void> {
        completeUser1.friends.push(completeUser2);
        completeUser2.friends.push(completeUser1);
        await this.UserRepository.save([completeUser1, completeUser2]);
    }

    //need to remove from friends?
    async addBlocked(user: user, userUuidToAdd: string): Promise<user[]> {
        const tofind = await this.getCompleteUser(userUuidToAdd);
        if (!tofind)
            return null;
        //need to throw
        user.blocked.push(tofind);
        await this.UserRepository.save(user);
        return user.blocked;
    }

    async removeFriend(user: user, tofind: user) {
        // const tofind = await this.getUser(userUuidToRemove);
        const idx = user.friends.findIndex((object) => {
            return object.userUuid === tofind.userUuid;
        })
        if (idx > -1) {
            user.friends.splice(idx);
            await this.UserRepository.save(user);
            return user.friends;
        }
        return
    }

    async removeBlocked(user: user, userUuidToRemove: string) {
        const tofind = await this.getUser(userUuidToRemove);
        const idx = user.blocked.findIndex((object) => {
            return object.userUuid === tofind.userUuid;
        })
        if (idx > -1) {
            user.blocked.splice(idx);
            await this.UserRepository.save(user);
            return user.blocked;
        }
        return
    }

    async getUser(userUuid: string): Promise<user> {
        if (!userUuid)
            return null;
        //need to throw
        const user = await this.UserRepository.findOne({ where: { userUuid: userUuid } });
        return user;
    }

    async getCompleteUser(userUuid: string): Promise<user> {
        // console.log("getCompleteUser", userUuid);
        if (!userUuid)
            return null;
        //need to throw
        const user = await this.UserRepository.findOne({ relations: { friends: true, blocked: true, }, where: { userUuid: userUuid } });
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
                online: false,
                requestPending: [],
                twoFactorAuth: false,
                wins: 0,
                losses: 0,
            });
        }
    }

    async FindOrCreateUserLocal(userToFindOrCreate: string): Promise<user> {
        let user: user = await this.UserRepository.findOne({ where: { userName: userToFindOrCreate, user42Id: 'local' } })
        if (!user) {
            user = await this.UserRepository.save({
                userName: userToFindOrCreate,
                user42Id: 'local',
                requestPending: [],
                online: false,
                twoFactorAuth: false,
                wins: 0,
                losses: 0,
            });
        }
        return user;
    }

    async changeUserName(user: user, newName: string): Promise<void> {
        //need check if userName already exist

        if (await this.UserRepository.findOne({ where: { userName: newName } })) {
            console.log("Error username already exist");
            return null;
            //need to throw
        }
        await this.UserRepository.update(user.userUuid, { userName: newName });
    }

    async disableTwoFactorAuth(user: user): Promise<user> {
        user.twoFactorAuth = false;
        await this.UserRepository.save(user);
        return user;
    }

    async enableTwoFactorAuth(user: user): Promise<user> {
        user.twoFactorAuth = true;
        await this.UserRepository.save(user);
        return user;
    }

    async endOfMatch(players: EndOfMatchDto): Promise<void> {
        await this.UserRepository.increment({ userUuid: players.loserUuid }, "losses", 1)
        await this.UserRepository.increment({ userUuid: players.winnerUuid }, "wins", 1)
    }
}