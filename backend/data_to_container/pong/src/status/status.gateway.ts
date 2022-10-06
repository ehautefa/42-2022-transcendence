import { Logger, Injectable, UseGuards, Req, Body } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { UserService } from 'src/user/user.service';
import { SendInviteDto } from './dto/sendInvite.dto';
import { SendAlertDto } from './dto/sendAlert.dto';
import { user } from 'src/bdd/users.entity';

var inline = new Map<string, string>();
			// Map<userUid, socketId>
// Map of all users connected and their socketId

@Injectable()
@WebSocketGateway({ cors: 
	{
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
	}, 
	namespace: '/status',
 })
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('StatusGateway')

	@SubscribeMessage('getUserUuid')
	@UseGuards(JwtAuthGuard)
	getUserUid(@Req() req): void {
		inline.set(req.user.userUuid, req.id);
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
	getFriendsStatus(client: Socket, users: user[] ): user[] {
		for (let i = 0; i < users.length; i++) {
			if (inline.has(users[i].userUuid)) {
				users[i].online = true;
			} else {
				users[i].online = false;
			}
		}
		return users;
	}

	handleConnection(client: any) {
		this.logger.log(`Client status connected: ${client.id}`);
		if (client.handshake.headers.cookie)
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
