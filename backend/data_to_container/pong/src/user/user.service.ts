import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from 'src/bdd/users.entity';
import { Equal, Repository, UpdateResult } from 'typeorm';
import { ChangeUserNameDto } from './dto/changeUserName.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EndOfMatchDto } from './dto/endOfMatch.dto';
import { FindOrCreateUserDto } from './dto/findOrCreate.dto';
import { FlipTwoFactorAuthDto } from './dto/flipTwoFactorAuyh.dto';
import { ArgUndefinedException, FailToFindAUniqNameException, FailToFindObjectFromanEntity, FailToFindObjectFromDBException, TwoFactorAuthAlreadyDisableException, TwoFactorAuthAlreadyEnableException, UserAreAlreadyFriends, UserAreNotBlocked, UserAreNotFriends, UserFriendRequestAlreadyPendingException, UserIsBlockedException, UserIsTheSameException, UserNameAlreadyExistException } from '../exceptions/user.exception';
import { authenticator } from 'otplib';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(user) private UserRepository: Repository<user>
    ) { }

    async getAllUser(): Promise<user[]> {
        return await this.UserRepository.find({ relations: { friends: true, blocked: true } });
    }
        
    async getAllUserUuidWithUserName(): Promise<user[]> {
        return await this.UserRepository.find({ select: { userUuid: true, userName: true } });
    }

    async getUserTwoFactorAuthenticationSecret(user: user): Promise<string> {
        
        const ret =  await this.UserRepository.findOne({ where : {userUuid: user.userUuid}, select: { twoFactorAuthenticationSecret: true} });
        return ret.twoFactorAuthenticationSecret;
    }

    async getFriends(userUuid: string): Promise<user[]> {
        if (!userUuid)
            throw new ArgUndefinedException('userUuid')
        return (await this.getCompleteUser(userUuid)).friends
    }

    isMyFriend(completeMe: user, completeUser2: user): boolean {
        this.checkUsers(completeMe, completeUser2);
        if (0 <= completeMe.friends.findIndex((object) => { return object.userUuid === completeUser2.userUuid })) {
            return true;
		}
        return false;
    }

    isBlocked(completeMe: user, completeUser2: user): boolean {
        this.checkUsers(completeMe, completeUser2);
        if (0 <= completeMe.blocked.findIndex((object) => { return object.userUuid === completeUser2.userUuid }))
            return true;
        return false;
    }

    async acceptFriendRequest(completeMe: user, completeUser2: user): Promise<user[]> {
        this.checkUsers(completeMe, completeUser2);
        const idx1 = completeMe.requestPending.findIndex((object) => { return object.userUuid === completeUser2.userUuid })
        if (idx1 >= 0)
        completeMe.requestPending.splice(idx1);
        else{
            throw new FailToFindObjectFromanEntity(completeUser2.userUuid, "requestPending", 'users')
        }
        
        await this.becomeFriend(completeMe, completeUser2);
        console.log("cant find request");
        return completeMe.requestPending;
    }

    async refuseFriendRequest(completeMe: user, completeUser2: user): Promise<user[]> {
        this.checkUsers(completeMe, completeUser2);
        const idx1 = completeMe.requestPending.findIndex((object) => { return object.userUuid === completeUser2.userUuid })
        if (idx1 < 0)
            throw new FailToFindObjectFromanEntity(completeUser2.userName, "requestPending", 'users')
        completeMe.requestPending.splice(idx1);
        await this.UserRepository.save(completeMe);
        return completeMe.requestPending;
    }

    async makeFriendRequest(completeMe: user, completeUser2: user): Promise<user[]> {
        this.checkUsers(completeMe, completeUser2);
        // allready friends need to throw
        if (this.isMyFriend(completeMe, completeUser2))
            throw new UserAreAlreadyFriends(completeMe.userName, completeUser2.userName)
        //ignore if I am blocked
        if (await this.isBlocked(completeUser2, completeMe))
            return completeMe.friends;
        //If I blocked the user unblock it
        if (this.isBlocked(completeMe, completeUser2))
            await this.removeBlocked(completeMe, completeUser2)

        const idx1 = completeMe.requestPending.findIndex((object) => { return object.userUuid === completeUser2.userUuid })
        const idx2 = completeUser2.requestPending.findIndex((object) => { return object.userUuid === completeMe.userUuid })
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
            await this.UserRepository.save(completeUser2);
            return completeMe.friends;
        }
        //already in pending
        else
            throw new UserFriendRequestAlreadyPendingException();
    }

    async becomeFriend(completeMe: user, completeUser2: user): Promise<user[]> {
        this.checkUsers(completeMe, completeUser2);
        if (this.isBlocked(completeUser2, completeMe))
            throw new UserIsBlockedException(completeMe.userName, completeUser2.userName);
        console.log("become friend");
        if (this.isMyFriend(completeMe, completeUser2) || this.isMyFriend(completeUser2, completeMe))
            throw new UserAreAlreadyFriends(completeMe.userName, completeUser2.userName)

        if (this.isBlocked(completeMe, completeUser2))
            await this.removeBlocked(completeMe, completeUser2)


        completeMe.friends.push(completeUser2);
        console.log("become friend");
        completeUser2.friends.push(completeMe);
        console.log("become friend");
        await this.UserRepository.save([completeMe, completeUser2]);
        console.log("become friend");
        return completeMe.friends;
    }

    async removeFriend(completeUser1: user, completeUser2: user): Promise<user[]> {
        this.checkUsers(completeUser1, completeUser2);

        const idx1 = completeUser1.friends.findIndex((object) => { return object.userUuid === completeUser2.userUuid })
        //remove for User1
        if (idx1 >= 0)
            completeUser1.friends.splice(idx1);
        //not friend
        else
            throw new UserAreNotFriends(completeUser1.userName, completeUser2.userName)

        const idx2 = completeUser2.friends.findIndex((object) => { return object.userUuid === completeUser1.userUuid })
        //remove for User2
        if (idx2 >= 0)
            completeUser2.friends.splice(idx2);
        //not friend
        else {
            await this.UserRepository.save(completeUser1);
            throw new UserAreNotFriends(completeUser1.userName, completeUser2.userName)
        }

        await this.UserRepository.save([completeUser1, completeUser2]);
        return completeUser1.friends;
    }


    //need to remove from request
    async addBlocked(completeMe: user, completeUser2: user): Promise<user[]> {
        this.checkUsers(completeMe, completeUser2);

        //remove from friend
        if (this.isMyFriend(completeMe, completeUser2))
            await this.removeFriend(completeMe, completeUser2)
        //remove from pending request
        const idx1: number = completeMe.requestPending.findIndex((object) => { return object.userUuid === completeUser2.userUuid })
        if (idx1 >= 0)
            completeMe.requestPending.splice(idx1);
        //remove from me from his pending request
        const idx2: number = completeUser2.requestPending.findIndex((object) => { return object.userUuid === completeMe.userUuid })
        if (idx2 >= 0) {
            completeUser2.requestPending.splice(idx2);
            await this.UserRepository.save(completeUser2);
        }
        //blocked user
        completeMe.blocked.push(completeUser2);
        await this.UserRepository.save(completeMe);
        return completeMe.blocked;
    }


    async removeBlocked(completeMe: user, completeUser2: user): Promise<user[]> {
        this.checkUsers(completeMe, completeUser2);

        const idx = completeMe.blocked.findIndex((object) => {
            return object.userUuid === completeUser2.userUuid;
        })
        if (idx >= 0) {
            completeMe.blocked.splice(idx);
            await this.UserRepository.save(completeMe);
            return completeMe.blocked;
        }
        else
            throw new UserAreNotBlocked(completeMe.userName, completeUser2.userName)
    }

    async getUser(userUuid: string): Promise<user> {
        if (!userUuid)
            throw new ArgUndefinedException('userUuid');
        const user: user = await this.UserRepository.findOne({ where: { userUuid: Equal(userUuid) } });
        if (!user)
            throw new FailToFindObjectFromDBException(userUuid, 'user');
        return user;
    }


    async getCompleteUser(userUuid: string): Promise<user> {
        if (!userUuid)
            throw new ArgUndefinedException('userUuid');
        const completeUser: user = await this.UserRepository.findOne({ relations: { friends: true, blocked: true, requestPending: true }, where: { userUuid: Equal(userUuid) } });
        //need to put it?
        // if (!completeUser)
        // throw new FailToFindObjectFromDBException(userUuid, 'user');
        return completeUser;
    }

    async FindOrCreateUser(user42Id: string, userName: string): Promise<user> {
        if (!user42Id)
            throw new ArgUndefinedException('user42Id');
        else if (!userName)
            throw new ArgUndefinedException('userName');
        const user = await this.UserRepository.findOne({ where: { user42Id: Equal(user42Id) } })
        if (user)
            return user;
        else {
            let numberToAdd: number = 1;
            let uniqueUserName: string = userName;
            while (numberToAdd < 60 && await this.UserRepository.findOne({ where: { userName: Equal(uniqueUserName) } }))
                uniqueUserName = userName + ++numberToAdd;
            // while (numberToAdd < 60) {
            // if (await this.UserRepository.findOne({ where: { userName: uniqueUserName } }))
            // numberToAdd++;
            // else
            // break
            // uniqueUserName = userName + numberToAdd;
            // }
            if (numberToAdd >= 60)
                throw new FailToFindAUniqNameException(uniqueUserName)

            return await this.UserRepository.save({
                userName: uniqueUserName,
                user42Id: user42Id,
                online: false,
                requestPending: [],
                twoFactorAuth: false,
                twoFactorAuthenticationSecret: 'none',
                wins: 0,
                losses: 0,
            });
        }
    }


    async FindOrCreateUserLocal(userToFindOrCreate: string): Promise<user> {
        if (!userToFindOrCreate)
            throw new ArgUndefinedException('userToFindOrCreate');
        const user: user = await this.UserRepository.findOne({ where: { userName: Equal(userToFindOrCreate), user42Id: Equal('local') } })
        if (user)
            return user
        else
            return await this.UserRepository.save({
                userName: userToFindOrCreate,
                user42Id: 'local',
                requestPending: [],
                online: false,
                twoFactorAuth: false,
                twoFactorAuthenticationSecret: 'none',
                wins: 0,
                losses: 0,
            });
    }

    async changeUserName(user: user, newName: string): Promise<user> {
        if (!user)
            throw new ArgUndefinedException('user');
        if (!newName)
            throw new ArgUndefinedException('newName');
        if (await this.UserRepository.findOne({ where: { userName: Equal(newName) } }))
            throw new UserNameAlreadyExistException(newName)
        user.userName = newName;
        await this.UserRepository.save(user)
        return user;
    }

    async disableTwoFactorAuth(user: user): Promise<user> {
        if (!user)
            throw new ArgUndefinedException('user');
        else if (!user.twoFactorAuth)
            throw new TwoFactorAuthAlreadyDisableException
        user.twoFactorAuth = false;
        user.twoFactorAuthenticationSecret = 'none';
        await this.UserRepository.save(user);
        return user;
    }

    async enableTwoFactorAuth(user: user): Promise<user> {
        if (!user)
            throw new ArgUndefinedException('user');
        else if (user.twoFactorAuth)
            throw new TwoFactorAuthAlreadyEnableException()
        user.twoFactorAuth = true;
        await this.UserRepository.save(user);
        return user;
    }

    async endOfMatch(loserUuid: string, winnerUuid: string): Promise<void> {
        if (!loserUuid)
            throw new ArgUndefinedException('loserUuid');
        if (!winnerUuid)
            throw new ArgUndefinedException('winnerUuid');
        await this.UserRepository.increment({ userUuid: Equal(loserUuid) }, "losses", 1)
        await this.UserRepository.increment({ userUuid: Equal(winnerUuid) }, "wins", 1)
    }

    checkUsers(user1: user, user2: user): void {
        if (!user1)
            throw new ArgUndefinedException('user1')
        else if (!user2)
            throw new ArgUndefinedException('user2')
        else if (user1.userUuid === user2.userUuid)
            throw new UserIsTheSameException();
    }

    async setTwoFactorAuthenticationSecret(user: user, secret: string) : Promise<user>{
        if (!user)
            throw new ArgUndefinedException('user')
        if (!secret)
            throw new ArgUndefinedException('secret')
        if (!secret)
            throw new ArgUndefinedException('secret')
        user.twoFactorAuthenticationSecret = secret;
        return await this.UserRepository.save(user);
      }

}