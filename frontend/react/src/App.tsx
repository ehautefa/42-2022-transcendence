import React from 'react';
import './index.css';
import { io } from 'socket.io-client'
import { useState, useEffect } from "react";


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


export function getSocket() {
	return socket;
}

export function FetchUser(uid: string) {
	const [user, setUser] = useState();
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
	
	var url:string = "http://localhost:3011/user/" + uid;
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
	};

	fetch(url, requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
		console.log("USER", user);
		return (user);
}

export function getMyUid() {
	
}

export default function App() {
	console.log('heere');

	// Connect my socket to server
	socket.on("connect", () => {
		console.log("SOCKET FRONT:", socket.id, " : ", socket.connected);
	});
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var urlencoded = new URLSearchParams();
	urlencoded.append("userName", "Elise");

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded
	};

	fetch("http://localhost:3011/user/create", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	FetchUser("22e21946-ac36-4c57-aa90-50442af094a3");
	return (
		<div className='login'>
			<a href="https://api.intra.42.fr/oauth/authorize?client_id=95976106d24d16c4735c8b3f39334abfb699b1295edc3ecb1b149054e27373b4&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FmainPage&response_type=code">
				<h1>Try to login</h1>
			</a>
		</div>
	);
}

