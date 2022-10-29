import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocketChat } from "../../../App";
import "../../../pages/chat/Chat.css";
import "../../../pages/chat/ChatPopup.css";

function ChangePassword({ room }: any) {
	const socket = getSocketChat();
	const [open, setOpen] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [password, setPassword] = useState("");


	const SendPassword = (e: any) => {
		e.preventDefault();
		console.log('set password ', password);
		// TO DO : send password to backend
		let param = {
			rommId: room.id,
			password: password,
			newPassword: newPassword
		}
		setOpen(false);
	};

	return (
		<div className="Popup-mother">
			<button className="side-menu-button" onClick={() => setOpen(true)}>Edit Password</button>
			<Popup open={open} closeOnDocumentClick onClose={() => {
				setOpen(false);
			}}>
				<div className='side-menu-popup'>
					<h3>Edit password :</h3>
					<input type="text" id="messagePopup" name="password"
						onChange={(e: { target: { value: any; }; }) => setPassword(e.target.value)}
						autoFocus
						autoCorrect="off"
						placeholder="Old password"
						minLength={1}
						maxLength={30}
						size={30} />
					<input type="text" id="messagePopup" name="password"
						onChange={(e: { target: { value: any; }; }) => setNewPassword(e.target.value)}
						autoFocus
						autoCorrect="off"
						placeholder="New password"
						minLength={1}
						maxLength={30}
						size={30} />
					<button onClick={SendPassword}>Save Password</button>
				</div>
			</Popup>
		</div >
	);
}

export default ChangePassword;