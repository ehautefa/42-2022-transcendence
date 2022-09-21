import './index.css';
import { io } from 'socket.io-client'
import Cookies from 'js-cookie' 

// Create my socket
let socketOptions = {
	transportOptions: {
		polling: {
			extraHeaders: {
				'access_token': Cookies.get('access_token')
			}
		}
	},
	forceNew: true
};

const URL_BACK: string = process.env.REACT_APP_BACK_URL === undefined ? "" : process.env.REACT_APP_BACK_URL;;
const socketPong = io(URL_BACK + "/pong", socketOptions);
const socketStatus = io(URL_BACK + "/status", socketOptions);


export function getSocketPong() {
	return socketPong;
}

export function getSocketStatus() {
	return socketStatus;
}

export default function App() {
	// Connect my socket to server
	socketPong.on("connect", () => {
		console.log("SOCKET PONG:", socketPong.id, " : ", socketPong.connected);
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

