import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocketChat } from "../../../App";
import "../../../pages/chat/Chat.css";
import "../../../pages/chat/ChatPopup.css";

function SetPassword({room} : any) {
	const socket = getSocketChat();
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState("");


	const SendPassword = (e: any) => {
		e.preventDefault();
		console.log('set password ', password);
		// TO DO : send password to backend

		setOpen(false);
	};

	return (
		<div className="Popup-mother">
			<button className="side-menu-button" onClick={() => setOpen(true)}>Set Password</button>
			<Popup open={open} closeOnDocumentClick onClose={() => {
				setOpen(false);
			}}>
				<div className='messagePopup'>
					<h3>Set a password :</h3>
					<div className='side-menu-popup'>
						<input type="text" id="messagePopup" name="password"
							onChange={(e: { target: { value: any; }; }) => setPassword(e.target.value)}
							autoFocus
							autoCorrect="off"
							placeholder="password"
							minLength={1}
							maxLength={30}
							size={30} />
					</div>
					<button onClick={SendPassword}>Save Password</button>
				</div>
			</Popup>
		</div >
	);
}

export default SetPassword;