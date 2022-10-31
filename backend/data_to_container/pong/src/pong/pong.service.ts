import { Injectable, Inject } from '@nestjs/common';
import { MatchService } from 'src/match/match.service';
import { GameWindowState } from './type';
import { playerDto } from './dto/player.dto';

@Injectable()
export class PongService {
    @Inject(MatchService)
    private readonly MatchService: MatchService;

    handlePaddle(game: GameWindowState, deltaPaddleY: number, userUuid: string): GameWindowState {
        if (userUuid == game.playerLeftUid) {
            if (game.paddleLeftY + deltaPaddleY >= parseInt(process.env.PONG_PADDLE_SIZE) && game.paddleLeftY + deltaPaddleY <= 100 - parseInt(process.env.PONG_PADDLE_SIZE))
                game.paddleLeftY += deltaPaddleY;
        }
        else if (userUuid == game.playerRightUid) {
            if (game.paddleRightY + deltaPaddleY >= parseInt(process.env.PONG_PADDLE_SIZE) && game.paddleRightY + deltaPaddleY <= 100 - parseInt(process.env.PONG_PADDLE_SIZE))
                game.paddleRightY += deltaPaddleY;
        }
        return game;
    }

    leaveGame(clientId: string, server: any, games: Map<string, GameWindowState>, players: playerDto[]) {
        for (let game of games.values()) {
            if ((game.playerLeft === clientId
                || game.playerRight === clientId)
                && game.begin === true) {
                if (game.isGameOver === false) {
                    if (game.playerLeft === clientId) {
                        server.to(game.playerRight).emit('leaveGame', game.playerLeftName);
                    } else {
                        server.to(game.playerLeft).emit('leaveGame', game.playerRightName);
                    }
                }
                console.log("DELETING GAME", game.matchId);
                games.delete(game.matchId);
            }
        }
        for (let i = 0; i < players.length; i++) {
            if (players[i].socket.id === clientId) {
                players.splice(i, 1);
            }
        }
    }

    refuseInvite(matchId: string) {
        this.MatchService.deleteMatch(matchId);
    }

    async initGame(client1: playerDto, client2: playerDto): Promise<GameWindowState> {
        var client1_socket: string = client1.socket === undefined ? "" : client1.socket.id;
        var client2_socket: string = client2.socket === undefined ? "" : client2.socket.id;
        var game: GameWindowState = {
            matchId: undefined,
            playerLeftUid: client1.userUuid,
            playerLeftName: client1.userName,
            playerLeft: client1_socket,
            playerRightUid: client2.userUuid,
            playerRightName: client2.userName,
            playerRight: client2_socket,
            ballY: parseInt(process.env.PONG_POS_BALL_Y),
            ballX: parseInt(process.env.PONG_POS_BALL_X),
            // randomly choose the direction
            ballSpeedX: parseInt(process.env.PONG_BALL_SPEED) * (Math.random() < 0.5 ? 1 : -1),
            ballSpeedY: parseInt(process.env.PONG_BALL_SPEED) * (Math.random() < 0.5 ? 1 : -1),
            scoreLeft: 0,
            scoreRight: 0,
            paddleLeftY: 50,
            paddleRightY: 50,
            isGameOver: false,
            matchMaking: true,
            begin: false,
        };
        await this.MatchService.createMatch({
            user1uid: client1.userUuid, // user1 is client Left
            user2uid: client2.userUuid // user2 is client Right
        }).then(match => {
            game.matchId = match.matchId;
            if (client1.socket !== undefined)
                client1.socket.join(match.matchId);
            if (client2.socket !== undefined)
                client2.socket.join(match.matchId);
        });
        return game;
    }

    hitLeftPaddle(game: GameWindowState): boolean {
        if (game.ballX <= parseInt(process.env.PONG_PADDLE_LEFT_X)
            && game.ballY >= game.paddleLeftY - parseInt(process.env.PONG_PADDLE_SIZE)  //- BALL_DIAM
            && game.ballY <= game.paddleLeftY + parseInt(process.env.PONG_PADDLE_SIZE))
            return true;
        return false;
    }

    hitRightPaddle(game: GameWindowState): boolean {
        if (game.ballX >= parseInt(process.env.PONG_PADDLE_RIGHT_X)
        && game.ballY >= game.paddleRightY - parseInt(process.env.PONG_PADDLE_SIZE)  //- BALL_DIAM
        && game.ballY <= game.paddleRightY + parseInt(process.env.PONG_PADDLE_SIZE))
            return true;
        return false;
    }

    hitBorder(game: GameWindowState): GameWindowState {
        if (game.ballX <= parseInt(process.env.PONG_LEFT_LIM)) { // Check if the ball hits the left wall
            game.scoreRight++;
            game = this.endpoint(game);
        } else if (game.ballX >= parseInt(process.env.PONG_RIGHT_LIM)) { // Check if the ball hits the right wall
            game.scoreLeft++;
            game = this.endpoint(game);
        } else if (game.ballY <= parseInt(process.env.PONG_TOP_LIM)) { // Check if the ball hits the top wall
            if (game.ballSpeedY < 0)
                game.ballSpeedY = -game.ballSpeedY;
        } else if (game.ballY >= parseInt(process.env.PONG_BOTTOM_LIM)) { // Check if the ball hits the bottom wall
            if (game.ballSpeedY > 0)
                game.ballSpeedY = -game.ballSpeedY;
        }
        return game;
    }


    sendGametoRoom(game: GameWindowState): GameWindowState {
        game.ballX = game.ballX + game.ballSpeedX;
        game.ballY = game.ballY + game.ballSpeedY;

        if (this.hitLeftPaddle(game)) {
            if (game.ballSpeedX < 0
                && game.ballY >= game.paddleLeftY - (parseInt(process.env.PONG_PADDLE_SIZE) - 1)  //- BALL_DIAM
                && game.ballY <= game.paddleLeftY + (parseInt(process.env.PONG_PADDLE_SIZE) - 1))
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
        }
        else if (this.hitRightPaddle(game)) {
            if (game.ballSpeedX > 0
                && game.ballY >= game.paddleRightY - (parseInt(process.env.PONG_PADDLE_SIZE) - 1)  //- BALL_DIAM
                && game.ballY <= game.paddleRightY + (parseInt(process.env.PONG_PADDLE_SIZE) - 1))
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
        } else {
            game = this.hitBorder(game);
        }
        return game;
    }

    endpoint(game: GameWindowState): GameWindowState {
        game.ballX = parseInt(process.env.PONG_POS_BALL_X);
        if (game.scoreLeft == parseInt(process.env.PONG_END_SCORE) || game.scoreRight == parseInt(process.env.PONG_END_SCORE)) {
            game.ballY = parseInt(process.env.PONG_POS_BALL_Y);
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
            game.ballSpeedX = parseInt(process.env.PONG_BALL_SPEED) * (Math.random() < 0.5 ? 1 : -1);
            game.ballSpeedY = parseInt(process.env.PONG_BALL_SPEED) * (Math.random() < 0.5 ? 1 : -1);
        }
        return game;
    }

}
