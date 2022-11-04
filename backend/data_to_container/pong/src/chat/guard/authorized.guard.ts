import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { ChatMember, user } from 'src/bdd';
import { UserService } from 'src/user/user.service';
import { ChatService } from '../chat.service';
import { Authorization } from '../decorator/authorized.decorator';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorization: Authorization[] = this.reflector.get<Authorization[]>(
      'authorization',
      context.getHandler(),
    );

    if (!authorization) return true;
    const user: user = context.switchToWs().getClient().user;
    const roomId: string = context.switchToWs().getData()['roomId'];
    if (authorization.includes('notBlocked')) {
      const otherUser: user = await this.chatService.getOtherDMUser(
        user.userUuid,
        roomId,
      );
      if (this.userService.isBlocked(otherUser, user))
        throw new WsException(`You have been blocked by ${otherUser.userName}`);
    }
    const chatMember: ChatMember = await this.chatService.findChatMember(
      user.userUuid,
      roomId,
    );
    const unBan: boolean =
      chatMember.bannedTime && new Date() > chatMember.bannedTime
        ? true
        : false;
    const unMute: boolean =
      chatMember.mutedTime && new Date() > chatMember.mutedTime ? true : false;
    if (unBan)
      this.chatService.removePunishment({
        userId: chatMember.user.userUuid,
        roomId: chatMember.room.id,
        unMute: unMute,
      });
    if (authorization.includes('notBanned') && chatMember.bannedTime)
      return false;
    if (authorization.includes('notMuted') && chatMember.mutedTime)
      return false;
    return true;
  }
}
