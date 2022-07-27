import React from 'react';
import './index.css';
// import { io } from 'socket.io-client';

// Create a socket to communicate with the backend
// export const socket = io("http://localhost:3001");

// export function getSocket() {
// 	return socket;
// }
	
export default function App() {
	// Connect socket to the backend
	// socket.on("connect", () => {
	// 	console.log("connection established ", socket.id);
	// });
	return (
		<div className='login'>
			<a href="https://api.intra.42.fr/oauth/authorize?client_id=95976106d24d16c4735c8b3f39334abfb699b1295edc3ecb1b149054e27373b4&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FmainPage&response_type=code">
				<h1>Try to login</h1>
			</a>
		</div>
	);
}

