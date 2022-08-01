import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import React from 'react'
import { io } from 'socket.io-client'

// Create my socket 
const socket = io('http://localhost:3011');

// Connect my socket to server
socket.on("connect", () => {
	console.log("SOCKET FRONT:", socket.id, " : ", socket.connected); 
});

// Send Gamewindow to connected client
const submitGame = (data: GameWindowState) => {
	socket.emit('game', data);
}

var receivedGame: GameWindowState = GameWindow.state;

// Receive GameWindow from the other player
socket.on('game', (data: GameWindowState) => {
	console.log(data);
	receivedGame = data;
})

class Ball extends React.Component<{ x: number, y: number }> {
	render() {
		return <div
			style={{
				top: `${this.props.y}%`,
				left: `${this.props.x}%`,
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
			ballSpeedX: 2 * (Math.random() < 0.5 ? 1 : -1),
			ballSpeedY: 2 * (Math.random() < 0.5 ? 1 : -1),
			scoreLeft: 0,
			scoreRight: 0,
			gameLoopTimeout:50, // time between game loops
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
		let ballX = 50;
		let ballY = 50;

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
				if (this.state.scoreLeft === 10 || this.state.scoreRight === 10) {
					this.setState({ isGameOver: true });
					this.resetGame();

				}
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
		// console.log("BALL COOR", ballX, ballY);
		let ballSpeedX = this.state.ballSpeedX;
		let ballSpeedY = this.state.ballSpeedY;
		let scoreLeft = this.state.scoreLeft;
		let scoreRight = this.state.scoreRight;

		let width = document.getElementById("GameBoard")!.clientWidth;
		let height = document.getElementById("GameBoard")!.clientHeight;
		
		// Check if the ball hits the left paddle
		if (ballX * width / 100 < Math.ceil(window.innerWidth * (this.state.paddleLeftX + 1)/ 100)
		&& (ballY * height / 100 > Math.floor((this.state.paddleLeftY - 15) * (this.state.maxY - this.state.minY) / 100))
		&& (ballY * height / 100 < Math.ceil((this.state.paddleLeftY + 15) * (this.state.maxY - this.state.minY) / 100))) {
			ballSpeedX = -ballSpeedX;
			// console.log("1");
		} // Check if the ball hits the right paddle
		else if (ballX * width / 100 > Math.floor(window.innerWidth * (this.state.paddleRightX - 1) / 100) - 30
		&& (ballY * height / 100 > Math.floor((this.state.paddleRightY - 15) * (this.state.maxY - this.state.minY) / 100))
		&& (ballY * height / 100 < Math.ceil((this.state.paddleRightY + 15) * (this.state.maxY - this.state.minY) / 100))) {
			ballSpeedX = -ballSpeedX;
			// console.log("2");
		} else {
			if (ballX * width / 100 < this.state.minX) { // Check if the ball hits the left wall
				ballSpeedX = -ballSpeedX;
				scoreRight++;
				// console.log("3");
			} else if (ballX * width / 100 > this.state.maxX - 30) { // Check if the ball hits the right wall
				// 30 is ball diameter
				ballSpeedX = -ballSpeedX;
				scoreLeft++;
				// console.log("4");
			} else if (ballY * height / 100 < this.state.minY) { // Check if the ball hits the top wall
				ballSpeedY = -ballSpeedY;
				// console.log("5");
			} else if (ballY * height / 100 > this.state.maxY - 30) { // Check if the ball hits the bottom wall
				// 30 is ball diameter
				ballSpeedY = -ballSpeedY;
				// console.log("6");
			}
		}
		// Update the ball position
		this.setState({ ballX, ballY, ballSpeedX, ballSpeedY, scoreLeft, scoreRight });
		submitGame(this.state); // Send GameWindow to other user
		this.setState({paddleLeftY: receivedGame.paddleRightY})
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

	resetGame() {
		// this.setState = {
		// 	ballY: 0,
		// 	ballX: 0,
		// 	// randomly choose the direction
		// 	ballSpeedX: 2 * (Math.random() < 0.5 ? 1 : -1),
		// 	ballSpeedY: 2 * (Math.random() < 0.5 ? 1 : -1),
		// 	scoreLeft: 0,
		// 	scoreRight: 0,
		// 	gameLoopTimeout:50, // time between game loops
		// 	timeoutId: 0,
		// 	paddleLeftY: 50,
		// 	paddleLeftX: 1,
		// 	paddleRightX: 79,
		// 	paddleRightY: 50,
		// 	minX: 0,
		// 	maxX: 0,
		// 	minY: 0,
		// 	maxY: 0,
		// 	isGameOver: false
		// };
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