import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import React from 'react'
import { getSocket } from "../../App"
import { useState } from "react"
import { useLocation } from "react-router-dom";

const socket = getSocket();
const PADDLE_GAP = 3; // in %
const PADDLE_DEP = 3; // in %

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
	paddleLeftX: number,
	paddleRightX: number,
	paddleRightY: number,
	id: number,
	isGameOver: boolean,
	playerLeft: string,
	playerRight: string,
	loading: boolean,
	matchMaking: boolean,
}


export class GameWindow extends React.Component<{ id: number }, GameWindowState> {
	constructor(props: any) {
		super(props);

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.state = {
			id: 0,
			ballY: 46.3,
			ballX: 48.2,
			scoreLeft: 0,
			scoreRight: 0,
			timeoutId: 0,
			paddleLeftY: 50,
			paddleLeftX: PADDLE_GAP,
			paddleRightX: 80 - PADDLE_GAP,
			paddleRightY: 50,
			isGameOver: false,
			playerLeft: "",
			playerRight: "",
			loading: false,
			matchMaking: false,
		};
	}

	componentDidMount() {
		window.addEventListener("keydown", this.handleKeyDown);
		this.gameLoop();
	}


	gameLoop() {
	socket.on('game', (data: GameWindowState) => {
		if (data.matchMaking === false) {
			console.log("matchmaking false");
			this.setState({loading: true});
		} else {
			console.log("matchmaking true");
			this.setState({loading: false});
		}
		this.setState({
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
			socket.emit('handlePaddle', deltaPaddleY, this.props.id);
		}
	}

	render() {
		return <div className="GameWindow" id="GameBoard">
			{this.state.loading ? (
				<div className="loader-container">
					<div className="spinner"></div>
				</div>
			) : (
				<>
					<Paddle x={this.state.paddleLeftX} y={this.state.paddleLeftY} />
					<Paddle x={this.state.paddleRightX} y={this.state.paddleRightY} />
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
	var id_state: number = index === null ? -1 : parseInt(index);
	const displaying_state = index === null ? { display: "block" } : { display: "none" };
	const [displaying, setDisplaying] = useState(displaying_state);
	const [id, setId] = useState(id_state);
	const uid = localStorage.getItem('uid');

	function matchMaking() {
		socket.emit('getPlayer', uid,  (id_game: number) => {
			setDisplaying({ display: "none" });
			setId(id_game);
		});
	}
	return (<div>
		<NavBar />
		<div className="mainComposantGame">
			<GameWindow id={id} />
			<button style={displaying}
				className="matchMakingButton"
				onClick={() => matchMaking()}>
				Find another player
			</button>
		</div>
	</div>)
}

export default Game;