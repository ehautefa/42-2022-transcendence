import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Logger, Post } from '@nestjs/common';
import { UserModule } from './user/user.module';

interface GameWindowState {
	ballX: number,
	ballY: number,
	ballSpeedX: number,
	ballSpeedY: number,
	scoreLeft: number,
	scoreRight: number,
	paddleLeftY: number,
	paddleRightY: number,
	isGameOver: boolean
	player1: string,
	player2: string,
	id: number,
	matchMaking: boolean,
}

var games: GameWindowState[] = [];

export function getGames(): GameWindowState[] {
	return games;
}

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})

export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private logger: Logger = new Logger('AppGateway');

	@SubscribeMessage('getPlayer')
	getPlayer(client: Socket): number {
		for (var i:number = 0; i < games.length; i++) {
			if (games[i].player2 === undefined) {
				games[i].player2 = client.id;
				client.join(i.toString());
				games[i].matchMaking = true;
				return i;
			}
		}
		var game:GameWindowState = {
			id: i,
			ballY: 46.3,
			ballX: 48.2,
			// randomly choose the direction
			ballSpeedX: 1 * (Math.random() < 0.5 ? 1 : -1),
			ballSpeedY: 1 * (Math.random() < 0.5 ? 1 : -1),
			scoreLeft: 0,
			scoreRight: 0,
			paddleLeftY: 50,
			paddleRightY: 50,
			isGameOver: false,
			player1: client.id,
			player2: undefined,
			matchMaking: false
		};
		games.push(game);
		console.log("GAMES[",i,"]", games[i]);
		client.join(i.toString());
		return i;
	}

	@SubscribeMessage('getGames')
	getGames(client: Socket): GameWindowState[] {
		return games;
	}
	
	@SubscribeMessage('joinRoom')
	joinRoom(client: Socket, id: number): number {
		if (id == undefined) {
			var game:GameWindowState = {
				id: -1,
				ballY: 46.3,
				ballX: 48.2,
				// randomly choose the direction
				ballSpeedX: 1 * (Math.random() < 0.5 ? 1 : -1),
				ballSpeedY: 1 * (Math.random() < 0.5 ? 1 : -1),
				scoreLeft: 0,
				scoreRight: 0,
				paddleLeftY: 50,
				paddleRightY: 50,
				isGameOver: false,
				player1: client.id,
				player2: undefined,
				matchMaking: false
			};

			id = games.push(game) - 1; // push return the new length of games
		} else {
			if (games[id].player2 === undefined) {
				games[id].player2 = client.id;
			}
		}
		client.join(id.toString());
		this.logger.log('joinRoom');
		return (id);
	}
	
	@SubscribeMessage('getGame')
	handleGame(client: Socket, data: GameWindowState): GameWindowState {
		var id:number  = data.id;
		if (id == undefined || games.length < id) 
			return data;
		if (games[id].matchMaking == false)
			return games[id];
		games[id].ballX = games[id].ballX + games[id].ballSpeedX;
		games[id].ballY = games[id].ballY + games[id].ballSpeedY;

		// Check if the ball hits the left paddle
		if (games[id].ballX <= 5.2
		&& games[id].ballY  >= games[id].paddleLeftY - 15
		&& games[id].ballY <= games[id].paddleLeftY + 15) {
			if (games[id].ballSpeedX < 0 && games[id].ballY >= games[id].paddleLeftY - 14 && games[id].ballY <= games[id].paddleLeftY + 14) // check if we have already hit the paddle
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
			&& games[id].ballY  >= games[id].paddleRightY - 15
			&& games[id].ballY <= games[id].paddleRightY + 15) {
				if (games[id].ballSpeedX > 0 && games[id].ballY >= games[id].paddleRightY - 14 && games[id].ballY <= games[id].paddleRightY + 14) // check if we have already hit the paddle
					games[id].ballSpeedX = -games[id].ballSpeedX;
				else if ((games[id].ballSpeedY > 0 && games[id].ballY <= games[id].paddleRightY) // check if we are above the paddle
					|| (games[id].ballSpeedY < 0 && games[id].ballY >= games[id].paddleRightY)) { // check if we are below the paddle
					games[id].ballSpeedY = -games[id].ballSpeedY;
					if (games[id].ballSpeedX > 0) // chck if we have already hit the paddle
						games[id].ballSpeedX = -games[id].ballSpeedX;
			}
			console.log("Hit right paddle", games[id].ballX, games[id].ballY);
			console.log("PADLLE", games[id].paddleRightY - 15, games[id].paddleRightY + 15);
		} else {
			if (games[id].ballX <= 0.2) { // Check if the ball hits the left wall
				this.endpoint(id);
				games[id].scoreRight++;
				console.log("Hits the left wall", games[id].ballX);
			} else if (games[id].ballX >= 95.9) { // Check if the ball hits the right wall
				this.endpoint(id);
				games[id].scoreLeft++;
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
		if (games[id].scoreLeft == 10 || games[id].scoreRight == 10) {
			games[id].ballY = 46;
			games[id].isGameOver = true;
			games[id].ballSpeedX = 0;
			games[id].ballSpeedY = 0;
		} else {
			games[id].ballY = Math.random() * 80 + 10;
			games[id].ballSpeedX = 0.5 * (Math.random() < 0.5 ? 1 : -1);
			games[id].ballSpeedY = 0.5 * (Math.random() < 0.5 ? 1 : -1);
		}
	}

	@SubscribeMessage('handlePaddle')
	handlePaddle(client: Socket, args: any): void {
		var id:number  = args[1];
		var deltaPaddleY:number = args[0];
		console.log("client", client.id, games[id].player1);

		if (client.id == games[id].player1) {
			if (games[id].paddleLeftY + deltaPaddleY >= 15 && games[id].paddleLeftY + deltaPaddleY <= 85)
				games[id].paddleLeftY += deltaPaddleY;
		}
		else if (client.id == games[id].player2) {
			if (games[id].paddleRightY + deltaPaddleY >= 15 && games[id].paddleRightY + deltaPaddleY <= 85)
				games[id].paddleRightY += deltaPaddleY;
		}
	}

	resetGame(id: number) {
		console.log("RESET GAME");
		games[id].ballX = 48.2;
		games[id].ballY = 46;
		games[id].ballSpeedX = 1 * (Math.random() < 0.5 ? 1 : -1);
		games[id].ballSpeedY = 1 * (Math.random() < 0.5 ? 1 : -1);
		games[id].scoreLeft = 0;
		games[id].scoreRight = 0;
		games[id].paddleLeftY = 50;
		games[id].paddleRightY = 50;
		games[id].isGameOver = false;
		// game.player1 = undefined;
		// game.player2 = undefined;
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