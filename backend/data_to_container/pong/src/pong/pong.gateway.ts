import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { MatchService } from 'src/match/match.service';
import { PongService } from "./pong.service";
import { GameWindowState } from "./type";
import { AuthGuard } from './pong.guards';
import { InvitePlayerDto } from './dto/invitePlayer.dto';
import { getPlayerDto } from './dto/getPlayer.dto';

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


	@SubscribeMessage('joinGame') // For spectator
	joinGame(client: Socket, id: number) {
		client.join(id.toString());
	}

	// // Invite a specific user to a game
	// @SubscribeMessage('invitePlayer')
	// invitePlayer(client: Socket, invitePlayerInfo: InvitePlayerDto) {
	// 	if (games.length == 0)
	// 		this.GameLoop(); // start game loop
	// 	for (var i: number = 0; i < games.length; i++) {
	// 		if (games[i].playerLeft == "" && games[i].playerRight == "") {
	// 			// reuse old structure if possible
	// 			client.join(i.toString());
	// 			let arg = [invitePlayerInfo.user1uid, invitePlayerInfo.user1name];
	// 			games[i] = this.PongService.initGame(i, arg, client.id);
	// 			return i;
	// 		}
	// 	}
	// 	// create new game
	// 	games.push(this.PongService.initGame(i, clientInfo, client.id));
	// 	console.log("GAMES[", i, "]", games[i]);
	// 	client.join(i.toString());
	// 	return i;
	// }

	// Launch a game and find a match for the player
	@UseGuards(AuthGuard)
	@SubscribeMessage('getPlayer')
	// clientInfo : {userUid, username}
	getPlayer(client: Socket, clientInfo: getPlayerDto): number {
		let auth_token : string = client.handshake.headers.authorization.split(' ')[1];
		console.log("Auth token", auth_token);
		if (games.length == 0)
			this.GameLoop(); // start game loop
		for (var i: number = 0; i < games.length; i++) {
			if (games[i].playerLeft == "" && games[i].playerRight == "") {
				// reuse old structure if possible
				client.join(i.toString());
				games[i] = this.PongService.initGame(i, clientInfo, client.id);
				return i;
			} else if (games[i].playerRight === undefined) {
				// find a game with only one player
				client.join(i.toString());
				games[i] = this.PongService.initSecondPlayer(games[i], clientInfo, client.id);
				return i;
			}
		}
		// create new game
		games.push(this.PongService.initGame(i, clientInfo, client.id));
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
			if (games[id].isGameOver)
            	console.log("game over", games[id].isGameOver, games[id].scoreRight, games[id].scoreLeft, games[id].playerLeft);
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
	resetGame(client: Socket, id: number) {
		client.leave(id.toString());
		games[id] = this.PongService.resetGame(games[id]);	
		return games[id];
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		for (let i: number = 0; i < games.length; i++) {
			if (games[i].playerLeft === client.id || games[i].playerRight === client.id) {
				games[i] = this.PongService.resetGame(games[i]);
				if (games[i].playerLeft === client.id) {
					this.server.to(i.toString()).emit('leaveGame', games[i].playerLeftName);
				} else {
					this.server.to(i.toString()).emit('leaveGame', games[i].playerRightName);
				}
				this.resetGame(client, i);
			}
		}
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}