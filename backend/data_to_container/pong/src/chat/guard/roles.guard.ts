import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
    const role: Role[] = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    if (!role) return true;
    const user: user = context.switchToWs().getClient().user;
    const roomId: string = context.switchToWs().getData()['roomId'];
    if (role.includes('admin')) {
      const chatMember: ChatMember = await this.chatService.findChatMember(
        user.userUuid,
        roomId,
      );
      return chatMember.isAdmin === true;
    } else if (role.includes('owner')) {
      const room: Room = await this.chatService.findRoomById(roomId);
      return room.owner.id === user.userUuid;
    }
  }
}
