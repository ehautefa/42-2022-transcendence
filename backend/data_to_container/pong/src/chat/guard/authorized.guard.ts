import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { ChatMember, RoomType, user } from 'src/bdd';
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
    const chatMember: ChatMember = await this.chatService.findChatMember(
      user.userUuid,
      roomId,
    );
    if (
      authorization.includes('notBlocked') &&
      chatMember.room.type === RoomType.DM
    ) {
      const otherUser: user = await this.chatService.getOtherDMUser(
        user.userUuid,
        roomId,
      );
      if (this.userService.isBlocked(otherUser, user))
        throw new WsException(`You have been blocked by ${otherUser.userName}`);
    }
    const unBan: boolean =
      chatMember.bannedTime !== null && (chatMember.bannedTime as Date).getTime() < new Date().getTime()
        ? true
        : false;
    const unMute: boolean =
      chatMember.mutedTime !== null && (chatMember.mutedTime as Date).getTime() < new Date().getTime() ? true : false;
    if (unBan)
      await this.chatService.removePunishment({
        userId: chatMember.user.userUuid,
        roomId: chatMember.room.id,
        unMute: false,
      });
    if (authorization.includes('notBanned') && (chatMember.bannedTime !== null && !unBan))
       return false;
    if (authorization.includes('notMuted') && (chatMember.mutedTime !== null && !unMute))
       return false;
    return true;
  }
}
