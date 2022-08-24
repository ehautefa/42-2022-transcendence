import { Injectable, Inject } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchService } from 'src/match/match.service';
import { GameWindowState } from './type';

const PADDLE_SIZE = 10; // in %
const BALL_SPEED = 1; // in %
const END_SCORE = 5;


@Injectable()
export class PongService {
    @Inject(MatchService)
    private readonly MatchService: MatchService;

    handlePaddle(game: GameWindowState, deltaPaddleY: number, clientID : string) : GameWindowState {
        if (clientID == game.playerLeft) {
			if (game.paddleLeftY + deltaPaddleY >= PADDLE_SIZE && game.paddleLeftY + deltaPaddleY <= 85)
				game.paddleLeftY += deltaPaddleY;
		}
		else if (clientID == game.playerRight) {
			if (game.paddleRightY + deltaPaddleY >= PADDLE_SIZE && game.paddleRightY + deltaPaddleY <= 85)
				game.paddleRightY += deltaPaddleY;
		}
        return game;
    }

    initSecondPlayer(game: GameWindowState, clientUid: string, clientID: string) : GameWindowState {
        game.playerRightUid = clientUid;
        game.playerRight = clientID;
        game.matchMaking = true;
        this.MatchService.createMatch({
            user1uid: game.playerLeftUid, // user1 is client Left
            user2uid: clientUid // user2 is client Right
        }).then(match => {
            game.matchId = match.matchId;
        });
        return game;
    }

    initGame(i: number, clientUid: string, clientID: string) : GameWindowState {
		var game: GameWindowState = {
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
			playerLeft: clientID,
			playerRight: undefined,
			matchMaking: false
		};
		return game;
    }

    sendGametoRoom(game: GameWindowState): GameWindowState {

        game.ballX = game.ballX + game.ballSpeedX;
        game.ballY = game.ballY + game.ballSpeedY;

        // Check if the ball hits the left paddle
        if (game.ballX <= 5.2
            && game.ballY >= game.paddleLeftY - PADDLE_SIZE
            && game.ballY <= game.paddleLeftY + PADDLE_SIZE) {
            if (game.ballSpeedX < 0
                && game.ballY >= game.paddleLeftY - (PADDLE_SIZE - 1)
                && game.ballY <= game.paddleLeftY + (PADDLE_SIZE - 1))
                // check if we have already hit the paddle
                game.ballSpeedX = -game.ballSpeedX;
            else if ((game.ballSpeedY > 0
                && game.ballY <= game.paddleLeftY) // check if we are above the paddle
                || (game.ballSpeedY < 0
                    && game.ballY >= game.paddleLeftY)) { // check if we are below the paddle
                game.ballSpeedY = -game.ballSpeedY;
                if (game.ballSpeedX < 0) // check if we have already hit the paddle
                    game.ballSpeedX = -game.ballSpeedX;
            }
            console.log("Hit left paddle", game.ballX, game.ballY);
        } // Check if the ball hits the right paddle
        else if (game.ballX >= 91.8
            && game.ballY >= game.paddleRightY - PADDLE_SIZE
            && game.ballY <= game.paddleRightY + PADDLE_SIZE) {
            if (game.ballSpeedX > 0
                && game.ballY >= game.paddleRightY - (PADDLE_SIZE - 1)
                && game.ballY <= game.paddleRightY + (PADDLE_SIZE - 1))
                // check if we have already hit the paddle
                game.ballSpeedX = -game.ballSpeedX;
            else if ((game.ballSpeedY > 0
                && game.ballY <= game.paddleRightY) // check if we are above the paddle
                || (game.ballSpeedY < 0
                    && game.ballY >= game.paddleRightY)) { // check if we are below the paddle
                game.ballSpeedY = -game.ballSpeedY;
                if (game.ballSpeedX > 0) // chck if we have already hit the paddle
                    game.ballSpeedX = -game.ballSpeedX;
            }
            console.log("Hit right paddle", game.ballX, game.ballY);
            console.log("PADLLE", game.paddleRightY - PADDLE_SIZE, game.paddleRightY + PADDLE_SIZE);
        } else {
            if (game.ballX <= 0.2) { // Check if the ball hits the left wall
                game.scoreRight++;
                game = this.endpoint(game);
                console.log("Hits the left wall", game.ballX);
            } else if (game.ballX >= 95.9) { // Check if the ball hits the right wall
                game.scoreLeft++;
                game = this.endpoint(game);
                console.log("Hits the right wall", game.ballX);
            } else if (game.ballY <= 0.1) { // Check if the ball hits the top wall
                if (game.ballSpeedY < 0)
                    game.ballSpeedY = -game.ballSpeedY;
                console.log("Hits the top wall", game.ballY);
            } else if (game.ballY >= 92.5) { // Check if the ball hits the bottom wall
                if (game.ballSpeedY > 0)
                    game.ballSpeedY = -game.ballSpeedY;
                console.log("Hits the bottom wall", game.ballY);
            }
        }
        return game;
    }

    endpoint(game: GameWindowState): GameWindowState {
		game.ballX = 48.2;
		if (game.scoreLeft == END_SCORE || game.scoreRight == END_SCORE) {
			game.ballY = 46.3;
			game.ballSpeedX = 0;
			game.ballSpeedY = 0;
			if (game.isGameOver == false) {
				this.MatchService.endOfMatch({
					player1Uuid: game.playerLeftUid,
					player2Uuid: game.playerRightUid,
					score1: game.scoreLeft,
					score2: game.scoreRight,
					matchId: game.matchId
				})
			}
			game.isGameOver = true;
		} else {
			game.ballY = Math.random() * 80 + 10;
			game.ballSpeedX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
			game.ballSpeedY = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
		}
        return game;
	}

}
