import NavBar from "../components/NavBar"
import Head from 'next/head'
import styles from "../styles/Game.module.css"
import { getSocket } from "./index"
import { useState } from 'react';

function Game() {
	// Recuperation de la socket initialiser dans index
	// const socket = getSocket();
	
	const [game, setGame] = useState();

	return (<div>
		<Head>
			<title>My Profile</title>
			<meta name="description" content="Pong" />
			<link rel="icon" href="./public/favicon.ico" />
		</Head>
		<NavBar />
		<div className={styles.mainComposant}>
			<canvas className={styles.canvas} width="512" height="256"/>
		</div>
	</div>)
}

export default Game