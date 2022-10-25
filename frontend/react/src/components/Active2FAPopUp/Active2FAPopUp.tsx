import Popup from 'reactjs-popup';
import { useState } from "react";

function Active2FAPopUp() {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
	const [qrCode, setQrCode] = useState("");

	async function generateQrCode() {
		setOpen(true);
		var credentials: RequestCredentials = "include";
		var url: string = process.env.REACT_APP_BACK_URL + "/auth/2fa/generateQrCode";
		var requestOptions = {
			method: 'POST',
			credentials: credentials
		};
	
		let result = await (await fetch(url, requestOptions)).json();
		console.log("Qrcode", result);
		if (result.statusCode === 401) {
			window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
		}
		setQrCode(result);
	}

    async function SendCode() {
        var credentials: RequestCredentials = "include";
		var url: string = process.env.REACT_APP_BACK_URL + "/auth/2fa/verify2FA";
		var urlencoded = new URLSearchParams();
		urlencoded.append("twoFactorAuthenticationCode", code);
		var requestOptions = {
			method: 'POST',
			credentials: credentials,
			body: urlencoded
		};
	
		let result = await fetch(url, requestOptions);
		console.log(result);
    }

    return (<div className="Popup-mother">
        <button className="enable" onClick={() => generateQrCode()}>Enable two-factor authentication</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);
            //  window.location.reload();
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
                <button type="submit" onClick={SendCode}>Send Code</button>
            </div>
        </Popup>
        </div>);
}

export default Active2FAPopUp;