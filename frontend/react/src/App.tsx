import React from 'react';
import './index.css';
import { io } from 'socket.io-client'
import { CreateUser } from "/usr/src/app/src/request"

type user = {
	userId: string;
	userName: string;
	twoFfactorAuth: boolean;
	wins: number;
	losses: number;
	friends: user[];
}

// Create my socket 
const socket = io("http://localhost:3011");

var uid: string = "";


export function getSocket() {
	return socket;
}



export function getMyUid() {
	return uid;
}

export default function App() {
	// Connect my socket to server
	socket.on("connect", () => {
		console.log("SOCKET FRONT:", socket.id, " : ", socket.connected);
	});
	if (uid == "")
		uid = CreateUser();
	// FetchUser("22e21946-ac36-4c57-aa90-50442af094a3");
	return (
		<div className='login'>
			<a href="https://api.intra.42.fr/oauth/authorize?client_id=95976106d24d16c4735c8b3f39334abfb699b1295edc3ecb1b149054e27373b4&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FmainPage&response_type=code">
				<h1>Try to login</h1>
			</a>
		</div>
	);
}

