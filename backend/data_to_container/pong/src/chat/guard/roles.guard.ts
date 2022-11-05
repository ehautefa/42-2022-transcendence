import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { ChatMember, Room, user } from 'src/bdd';
import { ChatService } from '../chat.service';
import { Role } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly chatService: ChatService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: Role[] = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    console.table(roles);
    if (!roles) return true;
    const user: user = context.switchToWs().getClient().user;
    const roomId: string = context.switchToWs().getData()['roomId'];
    if (roles.includes('admin')) {
      const chatMember: ChatMember = await this.chatService.findChatMember(
        user.userUuid,
        roomId,
      );
      if (chatMember.isAdmin !== true)
        throw new WsException('You must be admin to perform this action');
    } else if (roles.includes('owner')) {
      const room: Room = await this.chatService.findRoomById(roomId);
      if (room.owner.id !== user.userUuid)
        throw new WsException(
          'You must be the owner of the room to perform this action',
        );
    }
    return true;
  }
}
