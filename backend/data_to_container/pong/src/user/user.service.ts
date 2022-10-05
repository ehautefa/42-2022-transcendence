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

    async isMyFriend(completeMe: user, completeUser2: user): Promise<boolean> {
        // cant find user or same user
        if (!completeMe || !completeUser2 || completeMe.userUuid === completeUser2.userUuid)
            return
        const idx1: number = completeMe.friends.findIndex((object) => {
            return object.userUuid === completeUser2.userUuid;
        })
        if (idx1 >= 0)
            return true;
        else
            return false;
    }

    async isBlocked(completeMe: user, completeUser2: user): Promise<boolean> {
        // cant find user or same user
        if (!completeMe || !completeUser2 || completeMe.userUuid === completeUser2.userUuid)
            return
        const idx1: number = completeMe.blocked.findIndex((object) => {
            return object.userUuid === completeUser2.userUuid;
        })
        if (idx1 >= 0)
            return true;
        else
            return false;
    }

    async acceptFriendRequest(completeMe: user, completeUser2: user): Promise<user[]> {
        // cant find user or same user
        if (!completeMe || !completeUser2 || completeMe.userUuid === completeUser2.userUuid)
            return

        const idx1 = completeMe.requestPending.findIndex((object) => {
            return object.userUuid === completeUser2.userUuid;
        })
        if (idx1 >= 0)
            completeMe.requestPending.splice(idx1);
        // cant find request
        else
            return
        await this.becomeFriend(completeMe, completeUser2);
        return completeMe.requestPending;
    }

    async refuseFriendRequest(completeMe: user, completeUser2: user): Promise<user[]> {
        // cant find user or same user
        if (!completeMe || !completeUser2 || completeMe.userUuid === completeUser2.userUuid)
            return

        const idx1 = completeMe.requestPending.findIndex((object) => {
            return object.userUuid === completeUser2.userUuid;
        })
        if (idx1 >= 0) {
            completeMe.requestPending.splice(idx1);
            this.UserRepository.save(completeMe);
            return completeMe.requestPending;
        }
        //no request pending
        else
            return
    }

    async makeFriendRequest(completeMe: user, completeUser2: user): Promise<user[]> {
        //unblock when makeFriend request by me

        // cant find user or same user
        if (!completeMe || !completeUser2 || completeMe.userUuid === completeUser2.userUuid)
            return

        // allready friends need to throw
        if (this.isMyFriend(completeMe, completeUser2))
            return

        //ignore if I am blocked
        if (this.isBlocked(completeUser2, completeMe))
            return completeMe.friends;

        const idx1 = completeMe.requestPending.findIndex((object) => {
            return object.userUuid === completeUser2.userUuid;
        })
        const idx2 = completeUser2.requestPending.findIndex((object) => {
            return object.userUuid === completeMe.userUuid;
        })
        //symeetrical request
        if (idx1 >= 0) {
            completeMe.requestPending.splice(idx1);
            if (idx2 >= 0)
                completeUser2.requestPending.splice(idx2);
            return await this.becomeFriend(completeMe, completeUser2);
        }
        // not pending?
        else if (idx2 < 0) {
            completeUser2.requestPending.push(completeMe);
            this.UserRepository.save(completeUser2);
            return completeMe.friends;
        }
        //already in pending
        else
            return
    }

    //need to remove from blocked?
    async becomeFriend(completeMe: user, completeUser2: user): Promise<user[]> {

        //need to protect if I am blocked

        // cant find user or same
        if (!completeMe || !completeUser2 || completeMe.userUuid === completeUser2.userUuid)
            return
        //I'm blocked by the user2, impossible
        if (this.isBlocked(completeUser2, completeMe))
            return
        //allreadyFriend need to throw
        if (this.isMyFriend(completeMe, completeUser2) || this.isMyFriend(completeUser2, completeMe))
            return


        if (this.isBlocked(completeMe, completeUser2))
            this.removeBlocked(completeMe, completeUser2)

        completeMe.friends.push(completeUser2);
        completeUser2.friends.push(completeMe);
        await this.UserRepository.save([completeMe, completeUser2]);
        return completeMe.friends;
    }

    async removeFriend(completeUser1: user, completeUser2: user): Promise<user[]> {
        // cant find user
        if (!completeUser1 || !completeUser2 || completeUser1.userUuid === completeUser2.userUuid)
            return

        const idx1 = completeUser1.friends.findIndex((object) => {
            return object.userUuid === completeUser2.userUuid;
        })
        //remove for User1
        if (idx1 >= 0)
            completeUser1.friends.splice(idx1);
        //not friend
        else
            return

        const idx2 = completeUser2.friends.findIndex((object) => {
            return object.userUuid === completeUser1.userUuid;
        })
        //remove for User2
        if (idx2 >= 0)
            completeUser2.friends.splice(idx2);
        //not friend
        else {
            await this.UserRepository.save(completeUser1);
            return
        }

        await this.UserRepository.save([completeUser1, completeUser2]);
        return completeUser1.friends;
    }


    //need to remove from friends
    //need to remove from request
    async addBlocked(completeMe: user, completeUser2: user): Promise<user[]> {
        if (!completeMe || !completeUser2 || completeMe.userUuid === completeUser2.userUuid)
            return null;
        //need to throw
        if (this.isMyFriend(completeMe, completeUser2))
            this.removeFriend(completeMe, completeUser2)

        completeMe.blocked.push(completeUser2);
        await this.UserRepository.save(completeMe);
        return completeMe.blocked;
    }


    async removeBlocked(completeMe: user, completeUser2: user) {
        // cant find user or same user
        if (!completeMe || !completeUser2 || completeMe.userUuid === completeUser2.userUuid)
            return null;

        const idx = completeMe.blocked.findIndex((object) => {
            return object.userUuid === completeUser2.userUuid;
        })
        if (idx > -1) {
            completeMe.blocked.splice(idx);
            await this.UserRepository.save(completeMe);
            return completeMe.blocked;
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
        const user = await this.UserRepository.findOne({ relations: { friends: true, blocked: true, requestPending: true }, where: { userUuid: userUuid } });
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