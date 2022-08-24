import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { MatchService } from 'src/match/match.service';
import { PongService } from "./pong.service";
import { GameWindowState } from "./type";

const INTERVAL_TIME = 50; // in ms

var games: GameWindowState[] = [];

@WebSocketGateway({ cors: { origin: '*' }, }) // enable CORS everywhere
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('PongGateway');

	constructor(private readonly MatchService: MatchService, private readonly PongService: PongService) { }

	@Interval(INTERVAL_TIME)
	GameLoop() {
		for (let i: number = 0; i < games.length; i++) {
			if (!games[i].isGameOver && games[i].playerLeft) {
				this.sendGametoRoom(i);
			}
		}
	}

	@SubscribeMessage('getPlayer')
	getPlayer(client: Socket, clientUid: string): number {
		if (games.length == 0)
			this.GameLoop(); // start game loop
		for (var i: number = 0; i < games.length; i++) {
			if (games[i].playerRight === undefined) {
				client.join(i.toString());
				games[i] = this.PongService.initSecondPlayer(games[i], clientUid, client.id);
				return i;
			}
		}
		games.push(this.PongService.initGame(i, clientUid, client.id));
		console.log("GAMES[", i, "]", games[i]);
		client.join(i.toString());
		return i;
	}

	@SubscribeMessage('getGames')
	getGames(client: Socket): GameWindowState[] {
		return games;
	}

	sendGametoRoom(id: number) {
		if (id == undefined)
        	return;
		if (games[id].matchMaking == false) {
			try {
				this.server.to(id.toString()).emit('game', games[id]);
			} catch (error) {
				console.log("ERROR IN SEND GAME TO ROOM", error);
			}
			return ;
		}
		games[id] = this.PongService.sendGametoRoom(games[id]);
		try {
			this.server.to(id.toString()).emit('game', games[id]);
		} catch (error) {
			console.log("ERROR IN SEND GAME TO ROOM", error);
		}
	}

	

	@SubscribeMessage('handlePaddle')
	handlePaddle(client: Socket, args: any): void {
		games[args[1]] = this.PongService.handlePaddle(games[args[1]], args[0], client.id);
	}

	@SubscribeMessage('resetGame')
	resetGame(id: number) {
		console.log("RESET GAME");
		games[id].ballX = 48.2;
		games[id].ballY = 46;
		games[id].ballSpeedX = 0;
		games[id].ballSpeedY = 0;
		games[id].scoreLeft = 0;
		games[id].scoreRight = 0;
		games[id].paddleLeftY = 50;
		games[id].paddleRightY = 50;
		games[id].isGameOver = false;
		games[id].playerLeft = undefined;
		games[id].playerRight = undefined;
		return games[id];
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