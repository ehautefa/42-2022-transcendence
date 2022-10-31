import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import * as argon from 'argon2';
import { Room, RoomType } from 'src/bdd';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JoinRoomDto } from '../dto/join-room.dto';

@Injectable()
export class ProtectedRoomGuard implements CanActivate {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const dto: JoinRoomDto | ChangePasswordDto = context.switchToWs().getData();
    const room: Room = await this.roomRepository.findOneOrFail({
      select: { hash: true },
      where: { id: dto.roomId },
    });
    if (
      room.type === RoomType.PROTECTED &&
      (await argon.verify(room.hash, dto.password))
    )
      return true;
    throw new WsException('Invalid password');
  }
}
