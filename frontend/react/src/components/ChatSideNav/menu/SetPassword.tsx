import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocketChat } from "../../../Home";
import "./sideMenu.css";

function SetPassword({ room }: any) {
	const socket = getSocketChat();
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState("");


	const SendPassword = (e: any) => {
		e.preventDefault();
		console.log('set password ', password);
		let param = {
			roomId: room.id,
			password: "",
			newPassword: password
		}
		socket.emit('changePassword', param);
		setOpen(false);
	};

	return (
		<div className="Popup-mother">
			<button className="side-menu-button" onClick={() => setOpen(true)}>Set Password</button>
			<Popup open={open} closeOnDocumentClick onClose={() => {
				setOpen(false);
			}}>
				{/* <div className='messagePopup'> */}
				<div className='side-menu-popup'>
					<h3>Set a password :</h3>
					<input type="password" name="password"
						onChange={(e: { target: { value: any; }; }) => setPassword(e.target.value)}
						autoFocus
						autoCorrect="off"
						placeholder="password"
						minLength={1}
						maxLength={30}
						size={30} />
					<button onClick={SendPassword}>Save Password</button>
				</div>
				{/* </div> */}
			</Popup>
		</div >
	);
}

export default SetPassword;