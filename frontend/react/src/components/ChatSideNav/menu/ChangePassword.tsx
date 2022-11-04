import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocketChat } from "../../../Home";
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
		console.log('new password ', newPassword);
		console.log('room ', room.id);

		let param = {
			roomId: room.id,
			password: password,
			newPassword: newPassword
		}
		socket.emit('changePassword', param);
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
					<input type="password" id="messagePopup" name="password"
						onChange={(e: { target: { value: any; }; }) => setPassword(e.target.value)}
						autoFocus
						autoCorrect="off"
						placeholder="Old password"
						minLength={1}
						maxLength={30}
						size={30} />
					<input type="password" id="messagePopup" name="password"
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