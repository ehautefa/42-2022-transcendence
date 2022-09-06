import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import React from 'react'
import { getSocket } from "../../App" 
import { useState } from "react"
import { Navigate, useLocation } from "react-router-dom";
// import ReceivePopUp from "../../components/ReceivePopUp/ReceivePopUp"

const socket = getSocket();
const PADDLE_GAP = 3; // gap between border and paddle in %
const PADDLE_DEP = 2; // need to be a divisor of PADDLE_SIZE defined in PongService in %


socket.on('invitePlayer', (data: any) => {
	console.log("INVITE PLAYER ON", data);
	console.log('my uid', localStorage.getItem('uid'));
	if (data.invitedUid === localStorage.getItem('uid')) {
		console.log("You are invite by", data.userName);
		// open a popup with a link to the game
		alert("You are invite by " + data.userName);
	}
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


export class GameWindow extends React.Component<{ id: number }, GameWindowState> {
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
				this.setState({ loading: true });
			} else {
				this.setState({ loading: false });
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
				playerLeftName: data.playerLeftName,
				playerRightName: data.playerRightName
			});
			if (data.isGameOver) {
				socket.emit('resetGame', this.state.id);
			}
		})
		socket.on('leaveGame', (playerName: string) => {
			alert(`${playerName} has left the game`);
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

	ChangeColor() {

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
			{this.state.loading ? (
				<div className="loader-container">
					<div className="spinner"></div>
				</div>
			) : (
				<>
					<h2 className="PlayerName Left">{this.state.playerLeftName}</h2>
					<h2 className="PlayerName Right">{this.state.playerRightName}</h2>
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
	var id_state: number = index === null ? -1 : parseInt(index);
	const displaying_state = index === null ? { display: "block" } : { display: "none" };
	const [displaying, setDisplaying] = useState(displaying_state);
	const [id, setId] = useState(id_state);
	const uid = localStorage.getItem('uid');
	const userName = localStorage.getItem('userName');

	if (id !== -1) {
		socket.emit('joinGame', id);
	}

	function matchMaking() {
		let arg = {
			"userUuid": uid,
			"userName": userName
		}
		socket.emit('getPlayer', arg , (id_game: number) => {
			setDisplaying({ display: "none" });
			setId(id_game)
		});
	}
	return (<>
		<NavBar />
		<div className="mainComposantGame">
			<GameWindow id={id} />
			<button style={displaying}
				className="matchMakingButton"
				onClick={() => matchMaking()}>
				Find another player
			</button>
		</div>
	</>)
}

export default Game;