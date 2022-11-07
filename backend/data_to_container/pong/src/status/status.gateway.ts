import { Logger, UseGuards, UseFilters, Req } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { OnEvent } from '@nestjs/event-emitter';
import { SendInviteDto } from './dto/sendInvite.dto';
import { SendAlertDto } from './dto/sendAlert.dto';
import { user } from 'src/bdd/users.entity';
import { AllExceptionsFilter } from './status.exception.filter';
import { StatusService } from './status.service';

var inline = new Map<string, string>();
// Map<userUid, socketId>
// Map of all users connected and their socketId

@UseFilters(new AllExceptionsFilter())
@WebSocketGateway({
	cors:
	{
		origin: process.env.REACT_APP_FRONT_URL,
		methods: ["GET", "POST"],
		credentials: true,
	},
	namespace: '/status',
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('StatusGateway')

	constructor(private readonly StatusService: StatusService) { }

	@OnEvent('alert.send')
	sendAlert(sendAlert: SendAlertDto) {
		let socket = inline.get(sendAlert.userUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return;
		}
		this.server.to(socket).emit('sendAlert', sendAlert.message);
		console.log("Alert sent to " + sendAlert.userUuid);
	}

	@OnEvent('game.invite')
	sendInvitation(sendInvite: SendInviteDto) {
		let socket = inline.get(sendInvite.invitedUserUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return;
		}
		let response: any = { type: 'receive', matchId: sendInvite.matchId, userName: sendInvite.invitedUserName };
		this.server.to(socket).emit('sendInvite', response);
		console.log("Invitation sent to " + sendInvite.invitedUserName);
	}

	@OnEvent('room.invite')
	handleInviteEvent(userUuid: string) {
		let socket = inline.get(userUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return;
		}
		this.server.to(socket).emit('refreshRequest');
	}

	@OnEvent('user.refresh')
	refreshUserData(user : user) {
		let socket = inline.get(user.userUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return;
		}
		this.server.to(socket).emit('refreshUserData', user);
	}

	@SubscribeMessage('userRefresh')
	refreshUserData2(@Req() req : any) {
		let socket = inline.get(req.user.userUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return;
		}
		this.server.to(socket).emit('refreshUserData2');
	}

	@SubscribeMessage('getFriendsStatus')
	@UseGuards(JwtAuthGuard)
	getFriendsStatus(client: Socket, users: user[]): user[] {
		for (let i = 0; i < users.length; i++) {
			if (inline.has(users[i].userUuid)) {
				users[i].online = true;
			} else {
				users[i].online = false;
			}
		}
		return users;
	}

	async handleConnection(client: any) {
		this.logger.log(`Client status connected: ${client.id}`);
		var cookie: string = client.handshake.headers.cookie;
		if (cookie !== undefined &&
			cookie !== null
			&& cookie !== ""
			&& cookie.includes('access_token=')
			) {
				const accessToken: string = cookie
                .split('; ')
                .find((cookie: string) => cookie.startsWith('access_token='))
                .split('=')[1];
				if (accessToken === "" )
					return
			console.log("cookie in socket", client.handshake.headers.cookie);
			const userUuid: string = await this.StatusService.handleConnection(cookie);
			inline.set(userUuid, client.id);
		}
	}

	handleDisconnect(client: any) {
		this.logger.log(`Client status disconnected: ${client.id}`);
		for (const [key, value] of inline.entries()) {
			if (value === client.id) {
				inline.delete(key);
				return;
			}
		}
	}
}
