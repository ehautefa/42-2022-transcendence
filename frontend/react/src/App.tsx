import './index.css';
import { io } from 'socket.io-client'
import { CreateUser } from "./pages/myProfile/request";

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
const URL_BACK : string = process.env.REACT_APP_BACK_URL === undefined ? "" : process.env.REACT_APP_BACK_URL;; 
const socket = io(URL_BACK, socketOptions);




export function getSocket() {
	return socket;
}

export default function App() {
	var uid :string = localStorage.getItem('uid') !== null ? localStorage.getItem('uid')! : "";
	// Connect my socket to server
	socket.on("connect", () => {
		console.log("SOCKET FRONT:", socket.id, " : ", socket.connected);
	});
	if (uid === "") {
		let user = CreateUser();
		user.then((user) => {
			localStorage.setItem('uid', user.userUuid);
			console.log("userUuid:", user.userUuid);
			localStorage.setItem('userName', user.userName);
		})
	}

	return (
		<div className='login'>
			<a href={"https://api.intra.42.fr/oauth/authorize?client_id=" + process.env.REACT_APP_CLIENT_ID + "&redirect_uri=" + process.env.REACT_APP_REDIRECT_URI + "&response_type=code"}>
				<h1>Try to login</h1>
			</a>
		</div>
	);
}

