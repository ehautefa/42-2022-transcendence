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
	const [roomType, setRoomType] = useState("public");
	const [newChannel, setNewChannel] = useState("");

	const makeRoom = (e: any) => {
		e.preventDefault();
		console.log('creating room ', newChannel);
		socket.emit('createRoom', {
			name: newChannel, isProtected: false,
			password: "", type: roomType,
		});
		setNewChannel("");
		setOpen(false);
	};

	return (
		<div className="Popup-mother">
			<button type="submit" onClick={() => setOpen(true)}> Create New Room </button>
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
							placeholder="Room name"
							minLength={1}
							maxLength={30}
							size={30} />
						<span></span>
					</div>
					<div className="RoomTypeSelector" onChange={(e) => console.log(e.target)}>
						<p>Room Type :</p>
						<input type="radio" value="public" name="roomType" /> Public
						<input type="radio" value="private" name="roomType" /> Private
					</div>

					<button type="submit" onClick={makeRoom}>Save</button>
				</div>
			</Popup>
		</div >
	);
}

export default NewAgoraPopup;