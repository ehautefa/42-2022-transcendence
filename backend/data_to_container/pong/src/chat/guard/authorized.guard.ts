import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
      'roles',
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
      if (this.userService.isBlocked(user, otherUser)) return false;
    }
    const chatMember: ChatMember = await this.chatService.findChatMember(
      user.userUuid,
      roomId,
    );
    if (
      authorization.includes('notBanned') ||
      authorization.includes('notMuted')
    ) {
      let key: string;
      let unMute: boolean;
      if (authorization.includes('notBanned')) {
        key = 'bannedTime';
        unMute = false;
      } else {
        key = 'mutedTime';
        unMute = true;
      }

      if (chatMember[key] && Date.now() < chatMember[key]) return false;
      this.chatService.removePunishment({
        userId: chatMember.user.userUuid,
        roomId: chatMember.room.id,
        unMute: unMute,
      });
    }
    return true;
  }
}
