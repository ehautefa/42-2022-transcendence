import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

interface GameWindowState {
	minX: number,
	maxX: number,
	minY: number,
	maxY: number,
	ballX: number,
	ballY: number,
	ballSpeedX: number,
	ballSpeedY: number,
	gameLoopTimeout: number,
	timeoutId: any,
	scoreLeft: number,
	scoreRight: number,
	paddleLeftY: number,
	paddleLeftX: number,
	paddleRightX: number,
	paddleRightY: number,
	isGameOver: boolean
}
 
// @WebSocketGateway(3000, {  namespace: "pong" })
@WebSocketGateway({
	cors: {
	  origin: '*',
	},
  })

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('AppGateway');

	@SubscribeMessage('game')
	handleGame(client: Socket, data: GameWindowState): GameWindowState {
		console.log("BACKEND: game message received: ", data.paddleLeftY);
	
		this.server.emit('game', data); // broadcast to all clients in the server
		return data;
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	   }

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	   }
	  
	   handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	   }
}