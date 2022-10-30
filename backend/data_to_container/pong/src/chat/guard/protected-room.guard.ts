import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Room } from 'src/bdd';
import { ChatService } from '../chat.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JoinRoomDto } from '../dto/join-room.dto';

@Injectable()
export class ProtectedRoomGuard implements CanActivate {
  constructor(private readonly chatService: ChatService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const dto: JoinRoomDto | ChangePasswordDto = context.switchToWs().getData();
    const room: Room = await this.chatService.findRoomById(dto.roomId);
    return await argon.verify(room.hash, dto.password);
  }
}
