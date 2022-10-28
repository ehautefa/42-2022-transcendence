import { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { User } from "../../type";
import { getSocketChat, getSocketStatus } from "../../App";
import NavBar from "../../components/NavBar/NavBar";
import NewDMPopup from "./NewDMPopup";
import JoinAgoraPopup from "./JoinAgoraPopup";
import NewAgoraPopup from "./NewAgoraPopup";
import { getMe } from "../myProfile/request"
import ChatSideNav from "../../components/ChatSideNav/ChatSideNav";
import "./Chat.css";

//import {Route, NavLink, HashRouter} from 'react-router-dom'
//import { User } from "../../type";

const socketStatus = getSocketStatus();

socketStatus.on('getUserUuid', () => {
	socketStatus.emit('getUserUuid');
})

export type Room = {
	id: string,
	name: string,
}

function Chat() {
	const socket = getSocketChat();
	const emptyRoom = {id: "", name: ""};
	const emptyUser: User = { userUuid: "", userName: "" };
	const [user, setUser] = useState(emptyUser);
	const [messages, setMessages] = useState([]);
	const [channels, setChannels] = useState([]);
	const [selectedRoom, setSelectedRoom] = useState(emptyRoom);
	const [newMessage, setNewMessage] = useState("");
	async function fetchUser() {
		const user = await getMe();
		setUser(user);
	}

	useEffect(() => {
		fetchUser();
		socket.emit('findAllPublicRooms', (rooms: any) => { setChannels(rooms) });
	}, [socket]);

	// socket.on('updateMessages', () => {
	// 	socket.emit('findAllMessagesInRoom', { uuid: selectedRoom.id, }, (msgs: any) => {
	// 		console.log("msgs", msgs);
	// 		setMessages(msgs)
	// 	});
	// });

	socket.on('updateRooms', (rooms: any) => {
		console.log('getting information');
		socket.emit('findAllPublicRooms', (rooms: any) => {
			setChannels(rooms)
			// if (rooms.length > 0 && selectedRoom.id === "") {
			// 	console.log("setting selected room", rooms[0].id);
			// 	setSelectedRoom(rooms[0].id);
			// 	socket.emit('findAllMessagesInRoom', { uuid: rooms[0].id, }, (msgs: any) => {
			// 		console.log("msgs", msgs);
			// 		setMessages(msgs)
			// 	});
			// }
		});
	});

	async function chooseRoom(thisRoom: Room) {
		console.log("You chose room ", thisRoom);
		setSelectedRoom(thisRoom);
		socket.emit('findAllMessagesInRoom', { uuid: thisRoom.id, }, (msgs: any) => {
			console.log("FIND ALL MSG", msgs);
			setMessages(msgs)
		});
	}

	function sendMessage() {
		console.log('sending message: ', newMessage);
		socket.emit('createMessage', { message: newMessage, roomId: selectedRoom.id });
		setNewMessage("");
		socket.emit('findAllMessagesInRoom', { uuid: selectedRoom.id, }, (msgs: any) => {
			setMessages(msgs)
		});
	}

	return (<div>
		<NavBar />
		<div className="mainComposant">
			<div className="rooms">
				<h3>My Rooms</h3>
				<div className="channel">
					{channels.map((room: Room) => (
						<li key={room.id} onClick={() => chooseRoom(room)}>{room.name}</li>
					))}
				</div>
				<NewAgoraPopup />
				<JoinAgoraPopup />
			</div>
			<div className="chat">
				<ChatSideNav Room={selectedRoom}/>
				{messages.map((message: any) => (
					<div key={message.id}>
						{message.userName === user.userName ?
						<div className="message_mine">{message.message}</div> :
						<div className="message_other">{message.userName} : {message.message}</div>
						}
					</div>
				))}
				{/* // TO DO OSCAR : Transition doesn't work */}
				{/* <TransitionGroup className="messages">
					{messages ? (messages as any).map((message: any) => (
						message.sender.userUuid === user.userUuid ?
							(<CSSTransition key={message} timeout={500} classNames="fade">
								<div className="message_mine">me: {message}</div>
							</CSSTransition>) : (<CSSTransition key={message} timeout={500} classNames="fade">
								<div className="message_mine">{message.sender.userName}: {message}</div>
							</CSSTransition>))
					) : null
					}
				</TransitionGroup> */}
				<div className='input-flex'>
					<input type="text" id="message" name="username"
						value={newMessage}
						onChange={(e: { target: { value: any; }; }) => setNewMessage(e.target.value)}
						autoFocus
						onKeyPress={event => {
							if (event.key === 'Enter') { sendMessage() }
						}}
						minLength={1} />
					<button type="submit" onClick={sendMessage}>Send</button>
				</div>
			</div>
		</div>

	</div>)
}

export default Chat

