import React from "react"

export class Ball extends React.Component<{ x: number, y: number }> {
	render() {
		return <div
			style={{
				top: `${this.props.y}%`,
				left: `${this.props.x}%`,
			}}
			className="Ball" />
	}
}

export class Paddle extends React.Component<{ x: number, y: number }> {
	render() {
		return <div
			style={{
				top: `${this.props.y}%`,
				left: `${this.props.x}vw`,
			}}
			className="Paddle" />
	}
}

export interface GameWindowState {
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
