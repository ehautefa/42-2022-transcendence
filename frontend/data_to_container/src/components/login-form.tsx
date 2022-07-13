import { useState } from 'react';

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

export default function LoginForm({socket}: any) {
	console.log("LoginForm", socket.id);
	const [loginInfo, setLoginInfo] = useState(initialState);

	const setUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo({ ...loginInfo, username: e.target.value });
	}

	const setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo({ ...loginInfo, password: e.target.value });
	}

	const handleSubmit = () => {
	console.log("handle", socket.id);
	console.log("Username ", loginInfo.username, " Password ", loginInfo.password);
		socket.emit('custom-event', "coucou");
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
				<button type="button" onClick={handleSubmit}>Login</button>
			</form>
		</div>
	)
}