import NavBar from "../../components/NavBar/NavBar"
import "./Chat.css"
// import { getSocket } from "../to_import"
import { useState } from 'react'

function Game() {
	// Recuperation de la socket initialiser dans index
	// const socket = getSocket();
	var message: string;
	const [messages, setMessages] = useState([]);

	function handleChange(event:any) {
		message = event.target.value;
	}

	function sendMessage() {
		if (message) {
			console.log("Message a envoyer : ", message);
			// socket.emit("message", socket.id + ": " + message);
			message = "";
		}
	}

	// socket.on("message", function (msg: string) {
	// 	console.log("Message recu : ", msg);
	// 	setMessages([...messages, msg]);
	// })

	return (<div>
		<head>
			<title>My Profile</title>
			<meta name="description" content="My profile" />
			<link rel="icon" href="./public/favicon.ico" />
		</head>
		<NavBar />
		<div className="mainComposant">
			<div className="box">
				<div className="channel">
					<h3>Channel</h3>
				</div>
				<div className="channel">
					<h3>Members</h3>
				</div>
			</div>
			<div className="chat">
				<div className="messages">
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
						autoFocus
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