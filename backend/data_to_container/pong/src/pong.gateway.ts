import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { MatchService } from 'src/match/match.service;


const END_SCORE = 5;
const PADDLE_SIZE = 15; // in %
const BALL_SPEED = 1; // in %

interface GameWindowState {
	matchId: string,
  	ballX: number,
	ballY: number,
	ballSpeedX: number,
	ballSpeedY: number,
	scoreLeft: number,
	scoreRight: number,
	paddleLeftY: number,
	paddleRightY: number,
	isGameOver: boolean,
	playerLeftUid: string,
	playerRightUid: string,
	playerLeft: string,
	playerRight: string,
	id: number,
	matchMaking: boolean,
}

var games: GameWindowState[] = [];

@WebSocketGateway({ cors: { origin: '*'}, }) // enable CORS everywhere
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('AppGateway');

	@Inject('MatchService')
	private readonly matchService : MatchService;


	@SubscribeMessage('getPlayer')
	getPlayer(client: Socket, clientUid: string): number {
		for (var i:number = 0; i < games.length; i++) {
			if (games[i].playerRight === undefined) {
				games[i].playerRight = client.id;
				client.join(i.toString());
				games[i].matchMaking = true;
				games[i].matchId = this.matchService.createMatch({
					user1uid: games[i].playerLeftUid, // user1 is client Left
					user2uid: clientUid // user2 is client Right
				}).matchId;
				return i;
			}
		}
		var game:GameWindowState = {
			matchId: undefined,
			playerLeftUid: clientUid,
			playerRightUid: undefined,
			id: i,
			ballY: 46.3,
			ballX: 48.2,
			// randomly choose the direction
			ballSpeedX: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
			ballSpeedY: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
			scoreLeft: 0,
			scoreRight: 0,
			paddleLeftY: 50,
			paddleRightY: 50,
			isGameOver: false,
			playerLeft: client.id,
			playerRight: undefined,
			matchMaking: false
		};
		games.push(game);
		console.log("GAMES[",i,"]", games[i]);
		// client.join(i.toString());
		return i;
	}

	@SubscribeMessage('getGames')
	getGames(client: Socket): GameWindowState[] {
		return games;
	}
		
	@SubscribeMessage('getGame')
	handleGame(client: Socket, data: GameWindowState): GameWindowState {
		var id:number  = data.id;
		if (id == undefined)
			return data;
		if (games[id].matchMaking == false)
			return games[id];
		games[id].ballX = games[id].ballX + games[id].ballSpeedX;
		games[id].ballY = games[id].ballY + games[id].ballSpeedY;

		// Check if the ball hits the left paddle
		if (games[id].ballX <= 5.2
		&& games[id].ballY  >= games[id].paddleLeftY - PADDLE_SIZE
		&& games[id].ballY <= games[id].paddleLeftY + PADDLE_SIZE) {
			if (games[id].ballSpeedX < 0 && games[id].ballY >= games[id].paddleLeftY - (PADDLE_SIZE-1) && games[id].ballY <= games[id].paddleLeftY + (PADDLE_SIZE-1)) // check if we have already hit the paddle
				games[id].ballSpeedX = -games[id].ballSpeedX;
			else if ((games[id].ballSpeedY > 0 && games[id].ballY <= games[id].paddleLeftY) // check if we are above the paddle
				|| (games[id].ballSpeedY < 0 && games[id].ballY >= games[id].paddleLeftY)) { // check if we are below the paddle
				games[id].ballSpeedY = -games[id].ballSpeedY;
				if (games[id].ballSpeedX < 0)
					games[id].ballSpeedX = -games[id].ballSpeedX;
			}
			console.log("Hit left paddle", games[id].ballX, games[id].ballY);
		} // Check if the ball hits the right paddle
		else if (games[id].ballX >= 91.8
			&& games[id].ballY  >= games[id].paddleRightY - PADDLE_SIZE
			&& games[id].ballY <= games[id].paddleRightY + PADDLE_SIZE) {
				if (games[id].ballSpeedX > 0 && games[id].ballY >= games[id].paddleRightY - (PADDLE_SIZE-1) && games[id].ballY <= games[id].paddleRightY + (PADDLE_SIZE-1)) // check if we have already hit the paddle
					games[id].ballSpeedX = -games[id].ballSpeedX;
				else if ((games[id].ballSpeedY > 0 && games[id].ballY <= games[id].paddleRightY) // check if we are above the paddle
					|| (games[id].ballSpeedY < 0 && games[id].ballY >= games[id].paddleRightY)) { // check if we are below the paddle
					games[id].ballSpeedY = -games[id].ballSpeedY;
					if (games[id].ballSpeedX > 0) // chck if we have already hit the paddle
						games[id].ballSpeedX = -games[id].ballSpeedX;
			}
			console.log("Hit right paddle", games[id].ballX, games[id].ballY);
			console.log("PADLLE", games[id].paddleRightY - PADDLE_SIZE, games[id].paddleRightY + PADDLE_SIZE);
		} else {
			if (games[id].ballX <= 0.2) { // Check if the ball hits the left wall
				games[id].scoreRight++;
				this.endpoint(id);
				console.log("Hits the left wall", games[id].ballX);
			} else if (games[id].ballX >= 95.9) { // Check if the ball hits the right wall
				games[id].scoreLeft++;
				this.endpoint(id);
				console.log("Hits the right wall", games[id].ballX);
			} else if (games[id].ballY <= 0.1) { // Check if the ball hits the top wall
				if (games[id].ballSpeedY < 0)
					games[id].ballSpeedY = -games[id].ballSpeedY;
				console.log("Hits the top wall", games[id].ballY);
			} else if (games[id].ballY >= 92.5) { // Check if the ball hits the bottom wall
				if (games[id].ballSpeedY > 0)
					games[id].ballSpeedY = -games[id].ballSpeedY;
				console.log("Hits the bottom wall", games[id].ballY);
			}
		}
		return games[id];
	}

	endpoint(id: number) {
		games[id].ballX = 48.2;
		if (games[id].scoreLeft == END_SCORE || games[id].scoreRight == END_SCORE) {
			games[id].ballY = 46.3;
			games[id].isGameOver = true;
			games[id].ballSpeedX = 0;
			games[id].ballSpeedY = 0;
		} else {
			games[id].ballY = Math.random() * 80 + 10;
			games[id].ballSpeedX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
			games[id].ballSpeedY = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
		}
	}

	@SubscribeMessage('handlePaddle')
	handlePaddle(client: Socket, args: any): void {
		var id:number  = args[1];
		var deltaPaddleY:number = args[0];
		console.log("client", client.id, games[id].playerLeft);

		if (client.id == games[id].playerLeft) {
			if (games[id].paddleLeftY + deltaPaddleY >= PADDLE_SIZE && games[id].paddleLeftY + deltaPaddleY <= 85)
				games[id].paddleLeftY += deltaPaddleY;
		}
		else if (client.id == games[id].playerRight) {
			if (games[id].paddleRightY + deltaPaddleY >= PADDLE_SIZE && games[id].paddleRightY + deltaPaddleY <= 85)
				games[id].paddleRightY += deltaPaddleY;
		}
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