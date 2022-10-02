import { Logger, Injectable, UseGuards, Req, Body } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { HandleFriendDto } from 'src/user/dto/handleFriend.dto';
import { user } from 'src/bdd/users.entity';
import { UserService } from 'src/user/user.service';
import { SendInviteDto } from './dto/sendInvite.dto';
import { SendAlertDto } from './dto/sendAlert.dto';
import { Subscriber } from 'rxjs';
import { addFriendResponseDto } from './dto/addFriendResponse.dto';

type User = {
	userUuid: string;
	userName: string;
	status?: boolean;
	twoFfactorAuth?: boolean;
	wins?: number;
	losses?: number;
	friends?: User[];
}

var inline = new Map<string, string>();
			// Map<userUid, socketId>
// Map of all users connected and their socketId

@Injectable()
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/status' }) // enable CORS everywhere
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('PongGateway')
	constructor(private readonly UserService: UserService) {}

	@SubscribeMessage('getUserUuid')
	@UseGuards(JwtAuthGuard)
	getUserUid(@Req() req): void {
		inline.set(req.user.userUuid, req.id);
	}

	@SubscribeMessage('addFriend')
	@UseGuards(JwtAuthGuard)
	addFriend(@Req() req, @Body() userUuid : string) {
		let socket = inline.get(userUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return ;
		}
		let response: any = {type: 'addFriend', inviter: req.user};
		this.server.to(socket).emit('addFriend', response);
		console.log("Invitation sent to " + userUuid);
	}

	@SubscribeMessage('addFriendResponse')
	@UseGuards(JwtAuthGuard)
	addFriendResponse(@Req() req, @Body() body : addFriendResponseDto) {
		if (body.accept) {
			this.UserService.addFriend(req.user, body.inviter)
		} else {
			console.log("Friend request rejected");
		}
	}

	sendAlert(sendAlert : SendAlertDto) {
		let socket = inline.get(sendAlert.userUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return ;
		}
		this.server.to(socket).emit('sendAlert', sendAlert.message);
		console.log("Alert sent to " + sendAlert.userUuid);
	}

	sendInvitation(sendInvite : SendInviteDto) {
		let socket = inline.get(sendInvite.invitedUserUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return ;
		}
		let response: any = {type: 'receive', matchId: sendInvite.matchId, userName: sendInvite.invitedUserName};
		this.server.to(socket).emit('sendInvite', response);
		console.log("Invitation sent to " + sendInvite.invitedUserName);
	}

	@SubscribeMessage('getFriendsStatus')
	@UseGuards(JwtAuthGuard)
	getFriendsStatus(client: Socket, users: User[] ): User[] {
		for (let i = 0; i < users.length; i++) {
			if (inline.has(users[i].userUuid)) {
				users[i].status = true;
			} else {
				users[i].status = false;
			}
		}
		return users;
	}

	handleConnection(client: any) {
		this.logger.log(`Client status connected: ${client.id}`);
		client.emit('getUserUuid');
	}

	handleDisconnect(client: any) {
		this.logger.log(`Client status disconnected: ${client.id}`);
		for (const [key, value] of inline.entries()) {
			if (value === client.id) {
				inline.delete(key);
				return ;
			}
		}
	}
}
