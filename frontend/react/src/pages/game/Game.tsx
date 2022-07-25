import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
// import { getSocket } from "../to_import"
import { useState } from 'react';

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
			<canvas className="canvas" width="512" height="256"/>
		</div>
	</div>)
}

export default Game