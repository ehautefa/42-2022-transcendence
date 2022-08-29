import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import React from 'react'
import { getSocket } from "../../App"
import { useState } from "react"
import { Navigate, useLocation } from "react-router-dom";
import { textChangeRangeIsUnchanged } from "typescript"

const socket = getSocket();
const PADDLE_GAP = 3; // gap between border and paddle in %
const PADDLE_DEP = 2; // need to be a divisor of PADDLE_SIZE defined in PongService in %

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
	ballX: number,
	ballY: number,
	timeoutId: any,
	scoreLeft: number,
	scoreRight: number,
	paddleLeftY: number,
	paddleRightY: number,
	id: number,
	isGameOver: boolean,
	playerLeft: string,
	playerRight: string,
	loading: boolean,
	matchMaking: boolean,
	playerLeftName: string,
	playerRightName: string
}


export class GameWindow extends React.Component<{}, GameWindowState> {
	constructor(props: any) {
		super(props);

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.state = {
			id: 0,
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
			loading: false,
			matchMaking: false,
			playerLeftName: "",
			playerRightName: ""
		};
	}

	componentDidMount() {
		window.addEventListener("keydown", this.handleKeyDown);
		this.gameLoop();
	}


	gameLoop() {
	socket.on('game', (data: GameWindowState) => {
		if (data.matchMaking === false) {
			this.setState({loading: true});
		} else {
			this.setState({loading: false});
		}
		this.setState({
			id: data.id,
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
		});
		if (data.isGameOver) {
			socket.emit('resetGame', this.state.id);
		}
	})
	}

	componentWillUnmount() {
		clearTimeout(this.state.timeoutId);
		window.removeEventListener("keydown", this.handleKeyDown);
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
			socket.emit('handlePaddle', deltaPaddleY, this.state.id);
		}
	}

	render() {
		return <div className="GameWindow" id="GameBoard">
			{this.state.isGameOver && (this.state.scoreLeft > this.state.scoreRight
				&& this.state.playerLeft === socket.id ?
				(<Navigate to="/endGame/win" replace={true} />) :
				(<Navigate to="/endGame/lose" replace={true} />))
			}
			{this.state.loading ? (
				<div className="loader-container">
					<div className="spinner"></div>
				</div>
			) : (
				<>
					<Paddle x={PADDLE_GAP} y={this.state.paddleLeftY} />
					<Paddle x={80 - PADDLE_GAP} y={this.state.paddleRightY} />
					<div className="Score Right">{String(this.state.scoreRight).padStart(2, '0')}</div>
					<div className="Score Left">{String(this.state.scoreLeft).padStart(2, '0')}</div>
					<Ball x={this.state.ballX} y={this.state.ballY} />
				</>
			)}
		</div>
	}
}


function Game() {
	const index = new URLSearchParams(useLocation().search).get('id');
	const displaying_state = index === null ? { display: "block" } : { display: "none" };
	const [displaying, setDisplaying] = useState(displaying_state);
	const uid = localStorage.getItem('uid');

	function matchMaking() {
		socket.emit('getPlayer', uid,  () => {
			setDisplaying({ display: "none" });
		});
	}
	return (<div>
		<NavBar />
		<div className="mainComposantGame">
			<GameWindow />
			<button style={displaying}
				className="matchMakingButton"
				onClick={() => matchMaking()}>
				Find another player
			</button>
		</div>
	</div>)
}

export default Game;