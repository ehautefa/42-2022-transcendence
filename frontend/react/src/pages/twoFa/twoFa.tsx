import { useState } from "react";

function TwoFa() {
    const [code, setCode] = useState("");

    async function login() {
        var credentials: RequestCredentials = "include";
			var url: string = process.env.REACT_APP_BACK_URL + "/auth/login/twoFactorAuthentication";
			
            var urlencoded = new URLSearchParams();
			urlencoded.append("twoFactorAuthenticationCode", code);

			var requestOptions = {
				method: 'POST',
				credentials: credentials,
				body: urlencoded
			};
		
			let result = await fetch(url, requestOptions);
			console.log(result);
			// TO DO = redirect if ok, print error message otherwise
    }

    return (
        <div>
            <h1>Two Factor Authentication</h1>
            <h4>Enter Code</h4>
            <div className='input-flex'>
                    <input type="text" id="editUsername" name="username"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        autoFocus
                        autoCorrect="off"
                        placeholder="000000"
                        minLength={6}
                        maxLength={6}
                        size={6} />
                </div>
                <button type="submit" onClick={() => login()}>Send Code</button>
            </div>
    )
}

export default TwoFa;