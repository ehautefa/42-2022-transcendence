import Popup from 'reactjs-popup';
import { useState } from "react";

function FormCode2FAPopUp() {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");

	async function login(new_code: string) {
			var credentials: RequestCredentials = "include";
			var url: string = process.env.REACT_APP_BACK_URL + "/auth/login";
			
			var redirect : RequestRedirect = "follow";
            var urlencoded = new URLSearchParams();
			if (new_code !== "")
				urlencoded.append("twoFactorAuthenticationCode", new_code);
			var requestOptions = {
				method: 'GET',
				credentials: credentials,
                redirect: redirect,
				// body: urlencoded
			};
		
			let result = await fetch(url, requestOptions);
			console.log(result);
			// to do = redirect if ok, print error message otherwise
			// if (result.json()) { // 2FA active
			// 	setOpen(true);
			// }
	}

    return (<div className="Popup-mother">
        <button className="login-button" onClick={() => login("")}>Log In</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);
            }}>
            <div className='editUsername'>
                <label htmlFor="editUsername">Code :</label>
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
                <button type="submit" onClick={() => login(code)}>Send Code</button>
            </div>
        </Popup>
        </div>);
}

export default FormCode2FAPopUp;