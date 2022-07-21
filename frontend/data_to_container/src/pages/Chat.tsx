import NavBar from "../components/NavBar"
import Head from 'next/head'
import styles from "../styles/Chat.module.css"
import { getSocket } from "./index"
import { useState } from 'react'

function Game() {
	// Recuperation de la socket initialiser dans index
	const socket = getSocket();
	var message: string;
	const [messages, setMessages] = useState([]);

	function handleChange(event) {
		message = event.target.value;
	}

	function sendMessage() {
		if (message) {
			console.log("Message a envoyer : ", message);
			socket.emit("message", socket.id + ": " + message);
			message = "";
		}
	}

	socket.on("message", function (msg: string) {
		console.log("Message recu : ", msg);
		setMessages([...messages, msg]);
	})

	return (<div>
		<Head>
			<title>My Profile</title>
			<meta name="description" content="My profile" />
			<link rel="icon" href="./public/favicon.ico" />
		</Head>
		<NavBar />
		<div className={styles.mainComposant}>
			<div className={styles.box}>
				<div className={styles.channel}>
					<h3>Channel</h3>
				</div>
				<div className={styles.channel}>
					<h3>Members</h3>
				</div>
			</div>
			<div className={styles.chat}>
				<div className={styles.messages}>
					<ul>
						{messages.map((message: string) => (<li>{message}</li>))}
					</ul>
				</div>
				<form id="form" action="">
					<input
						id="input"
						autoComplete="off"
						type="text"
						onChange={handleChange}
						autofocus
					/>
					<button type="reset" onClick={sendMessage}>
						Send
					</button>
				</form>
			</div>
		</div>
	</div>)
}

export default Game