import React from 'react';
import './index.css';
import { io } from 'socket.io-client'
import { CreateUser } from "./pages/myProfile/request";

// Create my socket 
const socket = io("http://localhost:3011");



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
			<a href={"https://api.intra.42.fr/oauth/authorize?client_id=" + process.env.REACT_APP_CLIENT_ID + "&redirect_uri=" + process.env.REACT_APP_REDIRECT_URI + "&response_type=code"}>
				<h1>Try to login</h1>
			</a>
		</div>
	);
}

