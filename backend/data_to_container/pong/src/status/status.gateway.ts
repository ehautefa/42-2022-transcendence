import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Socket, Server } from 'socket.io';


const STATUS_INTERVAL_TIME = 1000; // 1 seconde
var inline = new Map<string, string>();

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'status' }) // enable CORS everywhere
export class StatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	afterInit(server: Server, ...args: any[]) {
		console.log('init', args);
	}

	handleConnection(client: any, ...args: any[]) {
		console.log('client connected', client.id, args);
	}

	handleDisconnect(client: any) {
		console.log('client disconnected', client.id);
	}
}
