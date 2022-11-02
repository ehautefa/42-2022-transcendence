import './index.css';
import './App.css';
import { io } from 'socket.io-client'
import Cookies from 'js-cookie'
import { useState } from 'react'

// Create my socket
let socketOptions = {
	// withCredentials: true,
	transportOptions: {
		polling: {
			extraHeaders: {
				'access_token': Cookies.get('access_token')
			}
		}
	},
	forceNew: true,
	// transports: ["polling"],
	secure: true
};

const URL_BACK: string = process.env.REACT_APP_BACK_URL === undefined ? "" : process.env.REACT_APP_BACK_URL;
const socketPong =  io(URL_BACK + "/pong", socketOptions);
const socketStatus = io(URL_BACK + "/status", socketOptions);
const socketChat =  io(URL_BACK + "/chat", socketOptions);
// const socketChat = socketPong;
// const socketStatus = socketPong;
// 
async function createUser(username: string) {
	var url: string = process.env.REACT_APP_BACK_URL + "/auth/localLogin/" + username;
	var credentials: RequestCredentials = "include";
	
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};
	
	await fetch(url, requestOptions);
	window.location.replace(process.env.REACT_APP_FRONT_URL + "/mainPage");
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

async function login() {
	var url: string = process.env.REACT_APP_BACK_URL + "/auth/login/" + username;
	var credentials: RequestCredentials = "include";
	
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};
	
	let result = await fetch(url, requestOptions);
	console.log(result);
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
			<button onClick={login}>try to login</button>
			{/* <a href={process.env.REACT_APP_BACK_URL + "/auth/login"}>Log in</a> */}
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

