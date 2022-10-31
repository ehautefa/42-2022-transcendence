import "./Game.css"
import React from 'react'
import { getSocketPong } from "../../App"
import { Navigate } from "react-router-dom";
import { Ball, Paddle, GameWindowState, ColorSelector } from "./element"

const socket = getSocketPong();

const PADDLE_GAP = process.env.REACT_APP_PADDLE_GAP === undefined ? 0 : parseInt(process.env.REACT_APP_PADDLE_GAP);
const PADDLE_DEP = process.env.REACT_APP_PADDLE_DEP === undefined ? 0 : parseInt(process.env.REACT_APP_PADDLE_DEP);
// TO DO : understand why env variable is not working

export class GameWindow extends React.Component<{ id: string }, GameWindowState> {
	constructor(props: any) {
		super(props);

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.state = {
			matchId: "",
			ballY: 47.1,
			ballX: 48.6,
			scoreLeft: 0,
			scoreRight: 0,
			timeoutId: 0,
			paddleLeftY: 50,
			paddleRightY: 50,
			isGameOver: false,
			playerLeft: "",
			playerRight: "",
			matchMaking: false,
			playerLeftName: "",
			playerRightName: ""
		};
	}

	componentDidMount() {
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("mousemove", this.handleMouseMove);
		this.gameLoop();
	}


	gameLoop() {
		socket.on('game', (data: GameWindowState) => {
			this.setState({
				matchId: data.matchId,
				ballX: data.ballX,
				ballY: data.ballY,
				scoreLeft: data.scoreLeft,
				scoreRight: data.scoreRight,
				paddleLeftY: data.paddleLeftY,
				paddleRightY: data.paddleRightY,
				isGameOver: data.isGameOver,
				playerLeft: data.playerLeft,
				playerRight: data.playerRight,
				matchMaking: data.matchMaking,
				playerLeftName: data.playerLeftName,
				playerRightName: data.playerRightName,
			});
		})
		socket.on('leaveGame', (playerName: string) => {
			console.log("leaveGame", this.state);
			alert(`${playerName} has left the game`);
		})
	}

	componentWillUnmount() {
		clearTimeout(this.state.timeoutId);
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("mousemove", this.handleMouseMove);
	}

	handleMouseMove(event: MouseEvent) {
		socket.emit('handlePaddle', { deltaPaddle: (event.movementY / 2), matchId: this.state.matchId });
	}

	handleKeyDown(event: KeyboardEvent) {
		var deltaPaddleY = 0
		switch (event.key) {
			case "ArrowUp":
				deltaPaddleY = -PADDLE_DEP;
				break;
			case "ArrowDown":
				deltaPaddleY = +PADDLE_DEP;
				break;
		}
		if (deltaPaddleY !== 0) {
			socket.emit('handlePaddle', { deltaPaddle: deltaPaddleY, matchId: this.state.matchId });
		}
	}

	render() {
		return <div className="GameWindow" id="GameBoard">
			{this.state.isGameOver
				&& this.state.playerLeft !== socket.id
				&& this.state.playerRight !== socket.id
				&& (<Navigate to="/endGame/GameOver" replace={true} />)
			}
			{this.state.isGameOver
				&& (this.state.playerLeft === socket.id
					|| this.state.playerRight === socket.id)
				&& (((this.state.scoreLeft > this.state.scoreRight
					&& this.state.playerLeft === socket.id)
					|| (this.state.scoreLeft < this.state.scoreRight
						&& this.state.playerRight === socket.id)) ?
					(<Navigate to="/endGame/win" replace={true} />) :
					(<Navigate to="/endGame/lose" replace={true} />))
			}
			<>
				<h2 className="PlayerName Left">{this.state.playerLeftName}</h2>
				<h2 className="PlayerName Right">{this.state.playerRightName}</h2>
				<Paddle x={PADDLE_GAP} y={this.state.paddleLeftY} />
				<Paddle x={70 - PADDLE_GAP} y={this.state.paddleRightY} />
				<div className="Score Right">{String(this.state.scoreRight).padStart(2, '0')}</div>
				<div className="Score Left">{String(this.state.scoreLeft).padStart(2, '0')}</div>
				<Ball x={this.state.ballX} y={this.state.ballY} />
				<ColorSelector />
			</>
		</div>
	}
}