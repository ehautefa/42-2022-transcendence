import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocketChat } from "../../Home";
import "./Chat.css";
import "./ChatPopup.css";

function NewAgoraPopup() {
	const socket = getSocketChat();
	const [open, setOpen] = useState(false);
	const [roomType, setRoomType] = useState("public");
	const [newChannel, setNewChannel] = useState("");

	function handleChange(event: any) {
		setRoomType(event.target.value);
	}

	const makeRoom = (e: any) => {
		e.preventDefault();
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
					<div className="RoomTypeSelector">
						<p>Room Type :</p>
						<div className='room-type-selector-flex'>
							<input type="radio" value="public" name="roomType" onChange={handleChange} checked={roomType === "public"}/> Public
							<input type="radio" value="private" name="roomType"  onChange={handleChange} checked={roomType === "private"}/> Private
						</div>
					</div>

					<button type="submit" onClick={makeRoom}>Save</button>
				</div>
			</Popup>
		</div >
	);
}

export default NewAgoraPopup;