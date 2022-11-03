import Popup from 'reactjs-popup';
import { useState } from "react";

function Active2FAPopUp() {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
	const [qrCode, setQrCode] = useState("");

	async function generateQrCode() {
		setOpen(true);
		var credentials: RequestCredentials = "include";
		var url: string = "/auth/2fa/generateQrCode";
		var requestOptions = {
			method: 'POST',
			credentials: credentials
		};
	
		let result = await (await fetch(url, requestOptions)).text();
		// if (result.statusCode === 401) {
		// 	window.location.assign("/auth/login");
		// }
		setQrCode(result);
	}

    async function SendCode() {
        var credentials: RequestCredentials = "include";
		var url: string = "/auth/2fa/verify2FA";
		var urlencoded = new URLSearchParams();
		urlencoded.append("twoFactorAuthenticationCode", code);
		var requestOptions = {
			method: 'POST',
			credentials: credentials,
			body: urlencoded
		};
	
		let result = await fetch(url, requestOptions);
		console.log(result);
		if (result.status === 201) {
			setOpen(false);
		} else if (result.status === 401) {
			window.location.assign("/auth/login");
		} else if (result.status === 403) {
			alert(result.statusText);
		}
    }

    return (<div className="Popup-mother">
        <button className="enable" onClick={() => generateQrCode()}>Enable two-factor authentication</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);
            }}>
            <div className='editUsername'>
				<h2>Scan this QrCode with Google Authenticator :</h2>
				<img src={qrCode} alt="qrCode" />
				<br></br>
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
                <button type="submit" onClick={SendCode}>Activate</button>
            </div>
        </Popup>
        </div>);
}

export default Active2FAPopUp;