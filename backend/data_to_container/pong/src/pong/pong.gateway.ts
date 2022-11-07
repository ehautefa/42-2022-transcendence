import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards, UseFilters, Req, Body } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PongService } from "./pong.service";
import { GameWindowState } from "./type";
import { invitePlayerDto } from './dto/invitePlayer.dto';
import { playerDto } from './dto/player.dto';
import { SendInviteDto } from "src/status/dto/sendInvite.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { handlePaddleDto } from "./dto/handlePaddle.dto";
import { AllExceptionsFilter } from './pong.exception.filter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendAlertDto } from "src/status/dto/sendAlert.dto";

@UseFilters(new AllExceptionsFilter())
@WebSocketGateway({
	cors:
	{
		origin: process.env.REACT_APP_FRONT_URL,
		methods: ["GET", "POST"],
		credentials: true,
	},
	namespace: '/pong',
}) // enable CORS everywhere
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('PongGateway');

	games: Map<string, GameWindowState>;
	players: playerDto[];
	launch_game: boolean;

	constructor(private readonly PongService: PongService,
		private eventEmitter: EventEmitter2) {
		this.games = new Map<string, GameWindowState>();
		this.players = new Array<playerDto>();
		this.launch_game = true;
	}

	@Interval(parseInt(process.env.PONG_INTERVAL_TIME))
	GameLoop() {
		for (let [key, value] of this.games) {
			if (!value.isGameOver && value.begin) {
				this.sendGametoRoom(key);
			}
		}
	}

	@SubscribeMessage('joinGame') // For spectator
	@UseGuards(JwtAuthGuard)
	joinGame(@Req() req, @Body() matchId: string): void {
		req.join(matchId);
		console.log("MAtchid ", matchId, this.games[matchId]);
		if (this.games.get(matchId).playerLeftUid === req.user.userUuid)
			this.games.get(matchId).playerLeft = req.id;
		else if (this.games.get(matchId).playerRightUid === req.user.userUuid)
			this.games.get(matchId).playerRight = req.id;

		if (this.games.get(matchId).playerLeft !== "" && this.games.get(matchId).playerRight !== "") {
			this.games.get(matchId).begin = true;
			this.server.to(matchId).emit('beginGame');
		}
	}

	// Invite a specific user to a game
	@SubscribeMessage('invitePlayer')
	@UseGuards(JwtAuthGuard)
	async invitePlayer(@Req() req, @Body() invitePlayer: invitePlayerDto): Promise<string> {
		let player1: playerDto = {
			userUuid: req.user.userUuid,
			userName: req.user.userName,
			socket: undefined
		};
		let player2: playerDto = {
			userUuid: invitePlayer.invitedUserUuid,
			userName: invitePlayer.invitedUserName,
			socket: undefined
		};
		let game: GameWindowState;
		game = await this.PongService.initGame(player1, player2);
		this.games.set(game.matchId, game);
		let response: SendInviteDto = {
			matchId: game.matchId,
			invitedUserName: invitePlayer.invitedUserName,
			invitedUserUuid: invitePlayer.invitedUserUuid
		};
		this.eventEmitter.emit('game.invite', response);
		console.log("GAME: ", game.matchId, "/n", game);
		return game.matchId;
	}

	@SubscribeMessage('refuseInvite')
	@UseGuards(JwtAuthGuard)
	refuseInvite(@Req() req, @Body() matchId: string): string {
		if (this.launch_game == true) {
			this.launch_game = false;
			this.GameLoop(); // start game loop
		}
		if (this.games.get(matchId) === undefined)
			return "";
		if (req.user.userUuid !== this.games.get(matchId).playerRightUid) {
			return "You are not the invited player";
		} else {
			var param: SendAlertDto = {
				userUuid: this.games.get(matchId).playerLeftUid,
				message: "Your opponent refused your invitation"
			}
			this.eventEmitter.emit('alert.send', param);
			this.games.delete(matchId);
		}
		this.PongService.refuseInvite(matchId);
		return "";
	}

	@SubscribeMessage('acceptInvite')
	@UseGuards(JwtAuthGuard)
	acceptInvite(@Req() req, @Body() matchId: string): string {
		if (this.launch_game == true) {
			this.launch_game = false;
			this.GameLoop(); // start game loop
		}
		console.log("ACCEPT INVITE", this.games.get(matchId))
		if (this.games.get(matchId) == undefined) {
			return "The other player destroyed his invitation";
		} else if (req.user.userUuid !== this.games.get(matchId).playerRightUid) {
			return "You are not the invited player";
		}
		return "";
	}

	// Launch a game and find a match for the player
	@SubscribeMessage('getPlayer')
	@UseGuards(JwtAuthGuard)
	async getPlayer(@Req() req): Promise<string> {
		let player: playerDto = { // create a player entity
			userUuid: req.user.userUuid,
			userName: req.user.userName,
			socket: req
		};
		let game: GameWindowState;
		if (this.launch_game == true) {
			this.launch_game = false;
			this.GameLoop(); // start game loop
		}
		if (this.players.length == 0) { // no player in the queue
			this.players.push(player);
			console.log("Player added to queue", this.players);
			return "";
		} else {
			for (var i: number = 0; i < this.players.length; i++) {
				if (this.players[i].userUuid == player.userUuid) { // player already in the queue
					console.log("Player already in queue");
					return "";
				}
			}
			game = await this.PongService.initGame(player, this.players.shift());
			this.games.set(game.matchId, game);
			this.server.to(game.matchId).emit('beginGame');
			console.log("GAME: ", game.matchId, "/n", game);
		}
		game.begin = true; // start game
		return game.matchId;
	}

	@SubscribeMessage('getGames')
	@UseGuards(JwtAuthGuard)
	getGames(): GameWindowState[] {
		return Array.from(this.games.values());
	}

	sendGametoRoom(matchId: string) {
		if (matchId == undefined)
			return;
		let game: GameWindowState = this.games.get(matchId);
		if (game.matchMaking == false) {
			try {
				this.server.to(matchId).emit('game', game);
			} catch (error) {
				console.log("ERROR IN SEND GAME TO ROOM", error);
			}
			return;
		}
		game = this.PongService.sendGametoRoom(game);
		try {
			this.server.to(matchId).emit('game', game);
		} catch (error) {
			console.log("ERROR IN SEND GAME TO ROOM", error);
		}
	}

	@SubscribeMessage('editPaddleSize')
	@UseGuards(JwtAuthGuard)
	editPaddleSize(@Req() req, @Body() size: string): void {
		for (let game of this.games.values()) {
			if (game.isGameOver == false &&
				game.matchMaking == true &&
				game.begin == true &&
				(game.playerLeftUid == req.user.userUuid ||
					game.playerRightUid == req.user.userUuid)) {
				game = this.PongService.editPaddleSize(game, size);
				break;
			}
		}
	}

	@SubscribeMessage('editBallColor')
	@UseGuards(JwtAuthGuard)
	editBallColor(@Req() req, @Body() color: string): void 
	{	
		for (let game of this.games.values()) {
			if (game.isGameOver == false &&
				game.matchMaking == true &&
				game.begin == true &&
				(game.playerLeftUid == req.user.userUuid ||
					game.playerRightUid == req.user.userUuid)) {
				game = this.PongService.editBallColor(game, color);
				break;
			}
		}
	}

	@SubscribeMessage('handlePaddle')
	@UseGuards(JwtAuthGuard)
	handlePaddle(@Req() req, @Body() handlePaddle: handlePaddleDto): void {
		this.games[handlePaddle.matchId] = this.PongService.handlePaddle(this.games.get(handlePaddle.matchId),
			handlePaddle.deltaPaddle,
			req.user.userUuid);
	}

	@SubscribeMessage('leaveGame')
	@UseGuards(JwtAuthGuard)
	leaveGame(@Req() req): void {
		this.PongService.leaveGame(req.id, this.server, this.games, this.players);
	}


	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		this.PongService.leaveGame(client.id, this.server, this.games, this.players);

	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}