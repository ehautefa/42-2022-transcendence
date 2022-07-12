import { SocketAddress } from 'net';
import { useState } from 'react';
// import io from 'socket.io-client'

//define type loginInfo

type loginInfo = {
	username: string;
	password: string;
	isError: boolean;
};

const initialState: loginInfo = {
	username: "",
	password: "",
	isError: false
};

export default function LoginForm() {
	const [loginInfo, setLoginInfo] = useState(initialState);

	const setUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo({ ...loginInfo, username: e.target.value });
	}

	const setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo({ ...loginInfo, password: e.target.value });
	}

	const handleSubmit = () => {
		console.log("Username ", loginInfo.username, " Password ", loginInfo.password);
		// const socket = io();
		// //Connect to server
		// socket.on("connect", (e) => {
		// 	console.log("connection established");

		// 	socket.emit("login", { name: username }, (data) => {
		// 		console.log(data);
		// 	});
		// });

	}

	return (
		<div className="login-form">
			<h1>Login</h1>
			<form>
				<label htmlFor="username">Username	</label>
				<input type="text"
					id="username"
					onChange={setUsername}
					autoComplete="on"
					required />
				<label htmlFor="password">Password  </label>
				<input type="password"
					id="password"
					onChange={setPassword}
					autoComplete="on"
					required />
				<button type="submit" onClick={handleSubmit}>Login</button>
			</form>
		</div>
	)
}