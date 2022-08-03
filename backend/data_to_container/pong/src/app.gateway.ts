import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

interface GameWindowState {
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
	player1: string,
	player2: string
}

var game:GameWindowState = {
	ballY: 46,
	ballX: 48.2,
	// randomly choose the direction
	ballSpeedX: 1 * (Math.random() < 0.5 ? 1 : -1),
	ballSpeedY: 1 * (Math.random() < 0.5 ? 1 : -1),
	scoreLeft: 0,
	scoreRight: 0,
	gameLoopTimeout:100, // time between game loops
	timeoutId: 0,
	paddleLeftY: 50,
	paddleLeftX: 1,
	paddleRightX: 79,
	paddleRightY: 50,
	isGameOver: false,
	player1: undefined,
	player2: undefined
};
 
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

	@SubscribeMessage('getGame')
	handleGame(client: Socket, data: GameWindowState): GameWindowState {
		if (data.ballSpeedX === 0 && data.ballSpeedY === 0)
			return this.resetGame();
		game.ballX = game.ballX + game.ballSpeedX;
		game.ballY = game.ballY + game.ballSpeedY;

		// Check if the ball hits the left paddle
		if (game.ballX <= 2.0
		&& game.ballY  >= game.paddleLeftY - 15
		&& game.ballY <= game.paddleLeftY + 15) {
			if (game.ballSpeedX < 0) // check if we have already hit the paddle
				game.ballSpeedX = -game.ballSpeedX;
			console.log("Hit left paddle", game.ballX, game.ballY);
		} // Check if the ball hits the right paddle
		else if (game.ballX >= 94.0
		&& game.ballY >= game.paddleRightY - 15
		&& game.ballY <= game.paddleRightY + 15) {
			if (game.ballSpeedX > 0) // check if we have already hit the paddle
				game.ballSpeedX = -game.ballSpeedX;
			console.log("Hit right paddle", game.ballX, game.ballY);
		} else {
			if (game.ballX <= 0.1) { // Check if the ball hits the left wall
				if (game.ballSpeedX < 0)
					game.ballSpeedX = -game.ballSpeedX;
				game.scoreRight++;
				console.log("Hits the left wall", game.ballX);
			} else if (game.ballX >= 96.1) { // Check if the ball hits the right wall
				if (game.ballSpeedX > 0)
					game.ballSpeedX = -game.ballSpeedX;
				game.scoreLeft++;
				console.log("Hits the right wall", game.ballX);
			} else if (game.ballY <= 0.2) { // Check if the ball hits the top wall
				if (game.ballSpeedY < 0)
					game.ballSpeedY = -game.ballSpeedY;
				console.log("Hits the top wall", game.ballY);
			} else if (game.ballY >= 92.0) { // Check if the ball hits the bottom wall
				if (game.ballSpeedY > 0)
					game.ballSpeedY = -game.ballSpeedY;
				console.log("Hits the bottom wall", game.ballY);
			}
		}

		// this.server.emit('game', data); // broadcast to all clients in the server
		return game;
	}

	@SubscribeMessage('handlePaddle')
	handlePaddle(client: Socket, deltaPaddleY: number): void {
		console.log("client", client.id);

		if (client.id == game.player1) {
			if (game.paddleLeftY + deltaPaddleY >= 15 && game.paddleLeftY + deltaPaddleY <= 85)
				game.paddleLeftY += deltaPaddleY;
		}
		else if (client.id == game.player2) {
			if (game.paddleRightY + deltaPaddleY >= 15 && game.paddleRightY + deltaPaddleY <= 85)
				game.paddleRightY += deltaPaddleY;
		}
	}

	resetGame() {
		console.log("RESET GAME");
		game.ballX = 48.2;
		game.ballY = 46;
		game.ballSpeedX = 1 * (Math.random() < 0.5 ? 1 : -1);
		game.ballSpeedY = 1 * (Math.random() < 0.5 ? 1 : -1);
		game.scoreLeft = 0;
		game.scoreRight = 0;
		game.gameLoopTimeout =100; // time between game loops
		game.timeoutId = 0;
		game.paddleLeftY = 50;
		game.paddleLeftX = 1;
		game.paddleRightX = 79;
		game.paddleRightY = 50;
		game.isGameOver = false;
		game.player1 = undefined;
		game.player2 = undefined;
		return game; 
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		if (game.player1 === client.id) {
			game.player1 = undefined;
		} else if (game.player2 === client.id) {
			game.player2 = undefined;
		}
	}
	  
	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		if (game.player1 === undefined) {
			game.player1 = client.id;
		} else if (game.player2 === undefined) {
			game.player2 = client.id;
		}
		console.log("PLAYERS", game.player1, game.player2);
	}
}