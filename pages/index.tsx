import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

let socket;


// component
const Home = () => {


	// connected flag
	const [connected, setConnected] = useState(false);

	// init chat and message
	const [chat, setChat] = useState([]);
	const [msg, setMsg] = useState("");

	useEffect(() => { socketInitializer(), [] })

	const socketInitializer = async () => {
		// connect to socket server
		const socket = io()

		// log socket connection
		socket.on("connect", () => {
			console.log("SOCKET CONNECTED!", socket.id);
			setConnected(true);
		});

		// update chat on new message dispatched
		socket.on('chat message', function (msg) {
			chat.push(msg);
			setChat([...chat]);
			socket.emit('chat message', "coucou ");
		});

		// socket disconnet onUnmount if exists
		if (socket) return () => socket.disconnect();
	}

	const sendMessage = async () => {
		if (msg) {
		  // build message obj

	
		  // dispatch message to other users
		 console.log("MESSAGE ", msg);
			setMsg("");
		}
	
	  };


	return (
		<div>
			<div>
				<input
					type="text"
					value={msg}
					placeholder={connected ? "Type a message..." : "Connecting..."}
					disabled={!connected}
					onChange={(e) => {
						setMsg(e.target.value);
					}}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							sendMessage();
						}
					}}
				/>
			</div>
			<div>
				<button
					onClick={sendMessage}
					disabled={!connected}
				>
					SEND
				</button>
			</div>
		</div>
	);
};

export default Home;