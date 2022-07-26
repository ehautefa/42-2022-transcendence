import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
// import { getSocket } from "../to_import"
import { useState } from "react";
import * as React from 'react';


class Ball extends React.Component {
	x: number;
	y: number;
	constructor (x = 200, y = 200) {
		super(x, y);
		if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
			throw new Error("Ball is out of bounds");
		}
		// this.x = 200;
		// this.y = 200;
		this.y = Math.floor(window.innerHeight / 2);
		this.x = Math.floor(window.innerWidth / 2);
	}
	render () {
		return <div 
		style={{
			top: `${this.y}px`,
			left: `${this.x}px`,
		 }}
			className="Ball"/>
	}
}


class GameWindow extends React.Component {
	ballY: number;
	ballX: number;
	vx: number;
	vy: number;
	speed: number;
   constructor(props:any) {
		super(props);
		this.ballY = Math.floor(window.innerHeight / 2);
		this.ballX = Math.floor(window.innerWidth / 2);
		// randomly choose the direction
		this.vx = 5 * (Math.random() < 0.5 ? 1 : -1); // accelleration
		this.vy = 5 * (Math.random() < 0.5 ? 1 : -1); // accelleration
		this.speed = 2 * (Math.random() < 0.5 ? 1 : -1); // speed
   }
   render () {
		return <div className="GameWindow">
			<Ball/>
		</div>
   }
}


function Game() {
	// Recuperation de la socket initialiser dans index
	// const socket = getSocket();
	
	const [game, setGame] = useState();

	return (<div>
		<head>
			<title>My Profile</title>
			<meta name="description" content="Pong" />
			<link rel="icon" href="./public/favicon.ico" />
		</head>
		<NavBar />
		<div className="mainComposant">
			<GameWindow/>
		</div>
	</div>)
}

export default Game;