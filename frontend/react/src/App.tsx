import './index.css';
import { io } from 'socket.io-client'

// Create my socket
let socketOptions = {
	transportOptions: {
		polling: {
			extraHeaders: {
				Authorization: 'Bearer 464654564'
			}
		}
	}
};

const URL_BACK: string = process.env.REACT_APP_BACK_URL === undefined ? "" : process.env.REACT_APP_BACK_URL;;
const socketPong = io(URL_BACK + "/pong", socketOptions);
const socketStatus = io(URL_BACK + "/status", socketOptions);
const socketChat = io(URL_BACK + "/chat", socketOptions);



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
			<a href={"http://localhost:3011/auth/login"}>
				<h1>Try to login</h1>
			</a>
		</div>
	</>
	);
}

