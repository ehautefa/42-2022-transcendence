import React from 'react';
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
	console.log ("uid:", uid);
	if (uid === "") {
		uid = CreateUser();
		console.log ("New uid:", uid);
		localStorage.setItem('uid', uid);
	}
	return (
		<div className='login'>
			<a href="https://api.intra.42.fr/oauth/authorize?client_id=95976106d24d16c4735c8b3f39334abfb699b1295edc3ecb1b149054e27373b4&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FmainPage&response_type=code">
				<h1>Try to login</h1>
			</a>
		</div>
	);
}

