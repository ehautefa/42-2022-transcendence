import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PongService } from "./pong.service";
import { GameWindowState } from "./type";
import { AuthGuard } from './pong.guards';
import { getPlayerDto } from './dto/getPlayer.dto';
import { AcceptInviteDto } from './dto/acceptInvite.dto';
import { invitePlayerDto } from './dto/invitePlayer.dto';
import { playerDto } from './dto/player.dto';

var games = new Map<string, GameWindowState>();
var players = new Array<playerDto>();

@WebSocketGateway({	cors: { origin: '*' }, namespace: 'pong'}) // enable CORS everywhere
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('PongGateway');

	constructor(private readonly PongService: PongService) { }

	@Interval(parseInt(process.env.PONG_INTERVAL_TIME))
	GameLoop() {
		for (let [key, value] of games) {
			console.log("GameLoop", key);
			if (!value.isGameOver && value.begin) {
				this.sendGametoRoom(key);
			}
		}
	}

	@SubscribeMessage('joinGame') // For spectator
	joinGame(client: Socket, arg:any) {
		var matchId:string = arg[0];
		var username:string = arg[1];
		console.log("joinGame", matchId, username, client.id);
		client.join(matchId);
		// if (games[id].playerLeftName === username)
		// 	games[id].playerLeft = client.id;
		// else if (games[id].playerRightName === username)
		// 	games[id].playerRight = client.id;

		// if (games[id].playerLeft !== "" && games[id].playerRight !== "") {
		// 	games[id].begin = true;
		// }
}

	// Invite a specific user to a game
	// @SubscribeMessage('invitePlayer')
	// invitePlayer(client: Socket, invitePlayer: invitePlayerDto) {
	// 	console.log("invitePlayer", invitePlayer);
	// 	let arg : getPlayerDto = {userUuid: invitePlayer.userUuid,
	// 		userName: invitePlayer.userName};
	// 	if (games.length == 0)
	// 		this.GameLoop(); // start game loop
	// 	for (var i: number = 0; i < games.length; i++) {
	// 		if (games[i].playerLeft == "" && games[i].playerRight == "") {
	// 			// reuse old structure if possible
	// 			games[i] = this.PongService.initGame(i, arg, "");
	// 			games[i].playerRightUid = invitePlayer.invitedUid; // mark match reserved to avoid matchmaking 
	// 			invitePlayer.id = i;
	// 			console.log("GAMES[", i, "]", games[i]);
	// 			this.server.emit('invitePlayer', invitePlayer);
	// 			return i;
	// 		}
	// 	}
	// 	// create new game
	// 	games.push(this.PongService.initGame(i, arg, ""));
	// 	games[i].playerRightUid = invitePlayer.invitedUid; // mark match reserved to avoid matchmaking 
	// 	invitePlayer.id = i;
	// 	// send invitation to all players
	// 	console.log("GAMES[", i, "]", games[i]);
	// 	this.server.emit('invitePlayer', invitePlayer);
	// 	return i;
	// }

	// @SubscribeMessage('acceptInvite') 
	// acceptInvite(client: Socket, acceptInvite: AcceptInviteDto) {
	// 	let arg : getPlayerDto = {userUuid: acceptInvite.userUuid,
	// 		 userName: acceptInvite.userName};
	// 	console.log("acceptInvite", arg);
	// 	let id: number = acceptInvite.id; // get id from invitation
	// 	client.join(id.toString());
	// 	games[id] = this.PongService.initSecondPlayer(games[id], arg, client.id);
	// 	console.log("GAMES[", id, "]", games[id]);
	// 	return id;
	// }

	// Launch a game and find a match for the player
	@UseGuards(AuthGuard)
	@SubscribeMessage('getPlayer')
	async getPlayer(client: Socket, clientInfo: getPlayerDto): Promise<string> {
		// let auth_token : string = client.handshake.headers.authorization.split(' ')[1];
		let player: playerDto = { // create a player entity
			userUuid: clientInfo.userUuid,
			userName: clientInfo.userName,
			socket: client
		};
		let game: GameWindowState;
		if (games.size == 0) {
			console.log("COUCOU");
			this.GameLoop(); // start game loop
		}
		if (players.length == 0) { // no player in the queue
			players.push(player);
			console.log("Player added to queue", players);
			return "";
		} else {
			for (var i: number = 0; i < players.length; i++) {
				if (players[i].userUuid == player.userUuid) { // player already in the queue
					console.log("Player already in queue");
					return "";
				}
			}
			game = await this.PongService.initGame(player, players.shift());
			games.set(game.matchId, game);
			console.log("GAME: ", game.matchId,"/n", game);
		}
		return game.matchId;
	}

	@SubscribeMessage('getGames')
	getGames(client: Socket): Map<string, GameWindowState> {
		return games;
	}

	sendGametoRoom(matchId: string) {
		console.log("sendGametoRoom", matchId);
		if (matchId == undefined)
        	return;
		let game: GameWindowState = games.get(matchId);
		if (game.matchMaking == false) {
			try {
				this.server.to(matchId).emit('game', game);
			} catch (error) {
				console.log("ERROR IN SEND GAME TO ROOM", error);
			}
			return ;
		}
		game = this.PongService.sendGametoRoom(game);
		try {
			if (game.isGameOver)
            	console.log("game over", game.isGameOver, game.scoreRight, game.scoreLeft, game.playerLeft);
			this.server.to(matchId).emit('game', game);
		} catch (error) {
			console.log("ERROR IN SEND GAME TO ROOM", error);
		}
	}

	@SubscribeMessage('handlePaddle')
	// args = [deltaPaddle, matchId]
	handlePaddle(client: Socket, args: any): void {
		games[args[1]] = this.PongService.handlePaddle(games[args[1]], args[0], client.id);
	}

	@SubscribeMessage('resetGame')
	resetGame(client: Socket, matchId: string): void {
		client.leave(matchId);
		games.delete(matchId);
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		for (let game of games.values()) {
			if (game.playerLeft === client.id || game.playerRight === client.id) {
				if (game.playerLeft === client.id) {
					this.server.to(game.matchId).emit('leaveGame', game.playerLeftName);
				} else {
					this.server.to(game.matchId).emit('leaveGame', game.playerRightName);
				}
				games.delete(game.matchId);
			}
		}
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}