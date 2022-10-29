import Popup from 'reactjs-popup';
import { useEffect, useState } from "react";
import { getSocketChat } from "../../App";
import "./Chat.css";
import Select from "react-select";
import { Room } from "../../type";
import { SelectClass } from "../../components/ChatSideNav/menu/toolsBox";

function JoinAgoraPopup() {
	const socket = getSocketChat();
	const [open, setOpen] = useState(false);
	const [completeRooms, setCompleteRooms] = useState([] as Room[]);
	const [rooms, setRooms] = useState([] as SelectClass[]);
	const [newRoomId, setNewRoomId] = useState("");
	const [password, setPassword] = useState(false);

	useEffect(() => {
		socket.emit('findAllPublicOrProtectedRooms', (rooms: Room[]) => {
			let selectTab: SelectClass[] = rooms.map((room) => new SelectClass(room));
			setRooms(selectTab);
			setCompleteRooms(rooms);
		})
	}, [socket]);


	const customStyles = {
		option: (provided: any, state: any) => ({
			...provided,
			color: '#FA0197',
			borderTop: '1px solid #DBACE3',
			boxShadow: '0px 0px 20px #7C4D84',
			backgroundColor: 'rgba(0, 0, 0, 1)',
			padding: 10,
		}),
		control: (styles: any) => ({
			...styles,
			color: '#FA0197',
			border: '1px solid #DBACE3',
			boxShadow: '0px 0px 10px #7C4D84',
			borderRadius: '5px',
			backgroundColor: 'rgba(0, 0, 0, 1)',
			padding: 5,
			margin: 40
		}),
		input: (styles: any) => ({
			...styles,
			color: '#FA0197',
		}),
		singleValue: (styles: any) => ({
			...styles,
			color: '#FA0197',
		}),
		noOptionsMessage: (styles: any) => ({
			...styles,
			color: '#FA0197',
			border: '1px solid #DBACE3',
			boxShadow: '0px 0px 10px #7C4D84',
			borderRadius: '5px',
			backgroundColor: 'rgba(0, 0, 0, 1)',
			padding: 5,

		}),
		
	}

	const handleChange = (newValue: any) => {
		setNewRoomId(newValue.value);
		console.log("handleChnge join room ", completeRooms.find((room) => room.id === newValue.id))
		if (completeRooms.find((room) => room.id === newValue.id)?.type === "public") {
			setPassword(true);
		}
	}

	function Submit() {
		const param = {
			roomId: newRoomId,
			password: ""
		}
		console.log("Join ROOM : ", param);
		socket.emit('joinRoom', param);
		setOpen(false);
	}


	return (
		<div className="Popup-mother">
			<button type="submit" onClick={() => setOpen(true)}> Join Room </button>
			<Popup open={open} closeOnDocumentClick onClose={() => {
				setOpen(false);
				// window.location.reload();
			}}>
				<div className='side-menu-popup'>
					<h3>Select a Room :</h3>
					<Select 
						// value={value}
							onChange={handleChange}
							styles={customStyles}
							options={rooms} />
					{password && <input type="password" placeholder="Password" />}
					<button onClick={Submit}>Join</button>
				</div>
			</Popup>
		</div >
	);
}

export default JoinAgoraPopup;

