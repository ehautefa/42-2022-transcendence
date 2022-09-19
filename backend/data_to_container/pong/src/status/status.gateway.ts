import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SendInviteDto } from './dto/sendInvite.dto';

export type User = {
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
@WebSocketGateway({ cors: { origin: '*' }, namespace: 'status' }) // enable CORS everywhere
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('getUserUuid')
	getUserUid(client: Socket, userUuid: string): void {
		inline.set(userUuid, client.id);
		console.log('init', client.id, userUuid);
		console.log("inline", inline);
	}

	sendInvitation(sendInvite : SendInviteDto) {
		let socket = inline.get(sendInvite.invitedUserUuid);
		if (!socket) {
			console.log('Error player disconnected');
			return ;
		}
		let response: any = {matchId: sendInvite.matchId, userName: sendInvite.invitedUserName};
		this.server.to(socket).emit('sendInvite', response);
		console.log("Invitation sent to " + sendInvite.invitedUserName);
	}

	@SubscribeMessage('getFriendsStatus')
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

	handleConnection(client: any, ...args: any[]) {
		console.log('client connected', inline);
		// client.emit('getUserUuid');
	}

	handleDisconnect(client: any) {
		console.log('client disconnected', client.id);
		for (const [key, value] of inline.entries()) {
			if (value === client.id) {
				inline.delete(key);
				return ;
			}
		}
	}
}