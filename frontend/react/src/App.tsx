import './index.css';
import './App.css';
import { io } from 'socket.io-client'
import Cookies from 'js-cookie'
import { useState } from 'react'

// Create my socket
let socketOptions = {
	transportOptions: {
		polling: {
			extraHeaders: {
				'access_token': Cookies.get('access_token')
			}
		}
	},
	forceNew: true,
	secure: true
};

const socketPong =  io("/pong", socketOptions);
const socketStatus = io("/status", socketOptions);
const socketChat =  io("/chat", socketOptions);

async function createUser(username: string) {
	var url: string = "/auth/localLogin/" + username;
	var credentials: RequestCredentials = "include";
	
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};
	
	await fetch(url, requestOptions);
	window.location.assign("/mainPage");
}

export function getSocketPong() {
	return socketPong;
}

export function getSocketStatus() {
	return socketStatus;
}

export function getSocketChat() {
	return socketChat;
}

export default function App() {
	// Connect my socket to server
	const [username, setUsername] = useState("");

	socketPong.on("connect", () => {
		console.log("SOCKET PONG:", socketPong.id, " : ", socketPong.connected);
	});
	socketChat.on("connect", () => {
		console.log("SOCKET CHAT:", socketChat.id, " : ", socketChat.connected);
	});
	socketStatus.on("connect", () => {
		console.log("SOCKET STATUS:", socketStatus.id, " : ", socketStatus.connected);
	});
	return (<>
		<div className='login'>
			<a href={"/auth/login"}>Log in</a>
			<div className='createUser'>
				<h5>Or use a local profile : </h5>
				<div>
					<input type="text" id="createUser" name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						autoFocus
						autoCorrect="off"
						placeholder="Username"
						minLength={4}
						maxLength={12}
						size={12} />
					<span></span>
				</div>
				<button type="submit" onClick={() => createUser(username)}>create</button>
			</div>
		</div>
	</>
	);
}

