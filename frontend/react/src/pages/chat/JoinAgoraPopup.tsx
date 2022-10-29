import Popup from 'reactjs-popup';
import { useEffect, useState } from "react";
import { getSocketChat } from "../../App";
import "./Chat.css";
import Select from "react-select";
import { Room } from "../../type";


class SelectClass {
	value: string;
	label: string;

	constructor(room: Room) {
		this.value = room.id;
		this.label = room.name;
	}
}


function JoinAgoraPopup() {
	const socket = getSocketChat();
	const [open, setOpen] = useState(false);
	const emptyRoom: SelectClass[] = [];
	const [rooms, setRooms] = useState(emptyRoom);
	const [newRoomId, setNewRoomId] = useState("");

	useEffect(() => {
		socket.emit('findAllPublicRooms', (rooms: Room[]) => {
			let selectTab: SelectClass[] = rooms.map((room) => new SelectClass(room));
			setRooms(selectTab);
		})
	}, []);


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
	}

	function Submit() {
		const param = {
			uuid: newRoomId,
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
					<button onClick={Submit}>Join</button>
				</div>
			</Popup>
		</div >
	);
}

export default JoinAgoraPopup;

