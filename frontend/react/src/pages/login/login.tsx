import { useState } from "react";

async function createUser(username: string) {
	var url: string = "/auth/localLogin/" + username;
	var credentials: RequestCredentials = "include";
	
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};
	
	await fetch(url, requestOptions);
	window.location.replace("/mainPage");
}

function Login() {
	const [username, setUsername] = useState("");

    return (
        <div className='login'>
            <a href={"/auth/login"}>Log in</a>
            <div className='createUser'>
                <h5>Or use a local profile : </h5>
                <div>
                    <input type="text" id="createUser" name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                        autoCorrect="off"
                        placeholder="Username"
                        minLength={4}
                        maxLength={12}
                        size={12} />
                    <span></span>
                </div>
                <button type="submit" onClick={() => createUser(username)}>create</button>
            </div>
        </div>
    )
}

export default Login;