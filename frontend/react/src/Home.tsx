import './index.css';
import './App.css';
import { io } from 'socket.io-client'
import Cookies from 'js-cookie'
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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

export function getSocketPong() {
	return socketPong;
}

export function getSocketStatus() {
	return socketStatus;
}

export function getSocketChat() {
	return socketChat;
}

function Home() {
	socketPong.on("connect", () => {
		console.log("SOCKET PONG:", socketPong.id, " : ", socketPong.connected);
	});
	socketChat.on("connect", () => {
		console.log("SOCKET CHAT:", socketChat.id, " : ", socketChat.connected);
	});
	socketStatus.on("connect", () => {
		console.log("SOCKET STATUS:", socketStatus.id, " : ", socketStatus.connected);
	});
	return (
		<>
			<Outlet />
		</>
	)
}

export default Home;