import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import React from 'react'

class Ball extends React.Component<{ x: number, y: number }> {
	render() {
		return <div
			style={{
				top: `${this.props.y}px`,
				left: `${this.props.x}px`,
			}}
			className="Ball" />
	}
}

class Paddle extends React.Component<{ x: number, y: number }> {
	render() {
		return <div
			style={{
				top: `${this.props.y}%`,
				left: `${this.props.x}vw`,
			}}
			className="Paddle" />
	}
}

interface GameWindowState {
	minX: number,
	maxX: number,
	minY: number,
	maxY: number,
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
}


class GameWindow extends React.Component<{}, GameWindowState> {
	constructor(props: any) {
		super(props);

		this.handleKeyDown = this.handleKeyDown.bind(this);

		this.state = {
			ballY: 0,
			ballX: 0,
			// randomly choose the direction
			ballSpeedX: 5 * (Math.random() < 0.5 ? 1 : -1),
			ballSpeedY: 5 * (Math.random() < 0.5 ? 1 : -1),
			scoreLeft: 0,
			scoreRight: 0,
			gameLoopTimeout: 50, // time between game loops
			timeoutId: 0,
			paddleLeftY: 50,
			paddleLeftX: 1,
			paddleRightX: 79,
			paddleRightY: 50,
			minX: 0,
			maxX: 0,
			minY: 0,
			maxY: 0,
			isGameOver: false
		};
	}

	componentDidMount() {
		this.initGame();
		window.addEventListener("keydown", this.handleKeyDown);
		this.gameLoop();
	}

	initGame() {
		let width = document.getElementById("GameBoard")!.clientWidth;
		let height = document.getElementById("GameBoard")!.clientHeight;
		let minX = 0;
		let maxX = minX + width;
		let minY = 0;
		let maxY = minY + height;
		let ballX = Math.floor(width * 0.5);
		let ballY = Math.floor(height * 0.5);

		this.setState({
			ballX,
			ballY,
			minX,
			minY,
			maxX,
			maxY
		});
	}

	gameLoop() {
		let timeoutId = setTimeout(() => {
			if (!this.state.isGameOver) {
				this.moveBall();
			}
			this.gameLoop();
		}, this.state.gameLoopTimeout);
		this.setState({ timeoutId });
	}

	componentWillUnmount() {
		clearTimeout(this.state.timeoutId);
		window.removeEventListener("keydown", this.handleKeyDown);
	}

	moveBall() {
		let ballX = this.state.ballX + this.state.ballSpeedX;
		let ballY = this.state.ballY + this.state.ballSpeedY;
		let ballSpeedX = this.state.ballSpeedX;
		let ballSpeedY = this.state.ballSpeedY;
		let scoreLeft = this.state.scoreLeft;
		let scoreRight = this.state.scoreRight;

		// Check if the ball hits the left paddle
		if (ballX <= Math.ceil(window.innerWidth * (this.state.paddleLeftX + 1)/ 100)
			&& (ballY >= Math.floor((this.state.paddleLeftY - 15) * (this.state.maxY - this.state.minY) / 100))
			&& (ballY <= Math.ceil((this.state.paddleLeftY + 15) * (this.state.maxY - this.state.minY) / 100))) {
			ballSpeedX = -ballSpeedX;
		} // Check if the ball hits the right paddle
		else if (ballX >= Math.floor(window.innerWidth * (this.state.paddleRightX - 1) / 100) - 30
			&& (ballY >= Math.floor((this.state.paddleRightY - 15) * (this.state.maxY - this.state.minY) / 100))
			&& (ballY <= Math.ceil((this.state.paddleRightY + 15) * (this.state.maxY - this.state.minY) / 100))) {
			ballSpeedX = -ballSpeedX;
		} else {
			if (ballX <= this.state.minX) { // Check if the ball hits the left wall
				ballSpeedX = -ballSpeedX;
				scoreRight++;
			} else if (ballX >= this.state.maxX - 30) { // Check if the ball hits the right wall
				// 30 is ball diameter
				ballSpeedX = -ballSpeedX;
				scoreLeft++;
			}

			if (ballY <= this.state.minY) { // Check if the ball hits the top wall
				ballSpeedY = -ballSpeedY;
			} else if (ballY >= this.state.maxY - 30) { // Check if the ball hits the bottom wall
				// 30 is ball diameter
				ballSpeedY = -ballSpeedY;
			}
		}
		// Update the ball position
		this.setState({ ballX, ballY, ballSpeedX, ballSpeedY, scoreLeft, scoreRight });
	}

	handleKeyDown(event: KeyboardEvent) {
		let deltaPaddleL = 0;
		let deltaPaddleR = 0;
		let paddleLeftY = this.state.paddleLeftY;
		let paddleRightY = this.state.paddleRightY;

		switch (event.key) {
			case "ArrowUp":
				deltaPaddleR = -5;
				break;
			case "ArrowDown":
				deltaPaddleR = +5;
				break;
			case "w":
				deltaPaddleL = -5;
				break;
			case "s":
				deltaPaddleL = +5;
				break;
		}
		// Check if the paddle is out of bounds
		if (deltaPaddleL + paddleLeftY < 15 || deltaPaddleL + paddleLeftY > 85)
			deltaPaddleL = 0;
		if (deltaPaddleR + paddleRightY < 15 || deltaPaddleR + paddleRightY > 85)
			deltaPaddleR = 0;
		// Update the paddle position
		this.setState({ paddleLeftY: paddleLeftY + deltaPaddleL, paddleRightY: paddleRightY + deltaPaddleR });
	}

	render() {
		return <div className="GameWindow" id="GameBoard">
			<Paddle x={this.state.paddleLeftX} y={this.state.paddleLeftY} />
			<Paddle x={this.state.paddleRightX} y={this.state.paddleRightY} />
			<div className={"Score" + " " + "Right"}>{String(this.state.scoreRight).padStart(2, '0')}</div>
			<div className={"Score" + " " + "Left"}>{String(this.state.scoreLeft).padStart(2, '0')}</div>
			<Ball x={this.state.ballX} y={this.state.ballY} />
		</div>
	}
}


function Game() {
	// Recuperation de la socket initialiser dans index
	// const socket = getSocket();

	return (<div>
		<NavBar />
		<div className="mainComposant">
			<GameWindow />
		</div>
	</div>)
}

export default Game;