import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocketChat, getSocketStatus } from "../../App";
import "./Chat.css";

const socketStatus = getSocketStatus();

socketStatus.on('getUserUuid', () => {
	socketStatus.emit('getUserUuid');
})

function NewAgoraPopup() {
	const socket = getSocketChat();
	const [open, setOpen] = useState(false);
	const [newChannel, setNewChannel] = useState("");

	const makeRoom = (e: any) => {
		e.preventDefault();
		console.log('creating room ', newChannel);
		socket.emit('createRoom', {
			name: newChannel, isProtected: false,
			password: "", type: 'public',
		});
		setNewChannel("");
		setOpen(false);
	};

	return (
			<div className="Popup-mother">
				<button type="submit" onClick={() => setOpen(true)}> Create </button>
				<Popup open={open} closeOnDocumentClick onClose={() => {
					setOpen(false);
					window.location.reload();
				}}>
					<div className='messagePopup'>
						<label htmlFor="messagePopup">Make new room :</label>
						<div className='input-flex'>
							<input type="text" id="messagePopup" name="username"
								value={newChannel}
								onChange={(e: { target: { value: any; }; }) => setNewChannel(e.target.value)}
								autoFocus
								autoCorrect="off"
								placeholder="..."
								minLength={1}
								maxLength={30}
								size={30} />
							<span></span>
						</div>
						<button type="submit" onClick={makeRoom}>Save</button>
					</div>
				</Popup>
			</div >
	);
}

export default NewAgoraPopup;