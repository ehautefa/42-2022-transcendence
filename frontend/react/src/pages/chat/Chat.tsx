import { useEffect, useState } from 'react';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { User } from "../../type";
import { getSocketChat } from "../../App";
import NavBar from "../../components/NavBar/NavBar";
import JoinAgoraPopup from "./JoinAgoraPopup";
import NewAgoraPopup from "./NewAgoraPopup";
import { getMe } from "../myProfile/request"
import ChatSideNav from "../../components/ChatSideNav/ChatSideNav";
import "./Chat.css";
import { Room } from "../../type";
import { useLocation } from 'react-router-dom';

function Chat() {
	const socket = getSocketChat();
	const emptyUser: User = { userUuid: "", userName: "" };
	const [user, setUser] = useState(emptyUser);
	const [messages, setMessages] = useState([]);
	const [channels, setChannels] = useState([] as Room[]);
	const [selectedRoom, setSelectedRoom] = useState({} as Room);
	const [newMessage, setNewMessage] = useState("");
	const [members, setMembers] = useState([] as User[]);
	const roomId = new URLSearchParams(useLocation().search).get('room');

	async function fetchUser() {
		const user = await getMe();
		setUser(user);
	}

	useEffect(() => {
		fetchUser();
		socket.emit('findAllJoinedRooms', (rooms: any) => {
			console.log("findAllJoined", rooms);
			setChannels(rooms)
			if (roomId) {
				setSelectedRoom(rooms.find((room: any) => room.roomId === roomId));
			}
		});
	}, [socket, roomId]);

	useEffect(() => {
		if (selectedRoom && selectedRoom.id !== undefined && selectedRoom.id !== "") {
			socket.emit('findAllJoinedRooms', (rooms: any) => {
				console.log("findAllJoined", rooms);
				setChannels(rooms)
			});
			socket.emit('findAllMessagesInRoom', { uuid: selectedRoom.id }, (msgs: any) => {
				setMessages(msgs);
				var message = document.getElementById('messages');
				if (message)
					message.scroll({
						top: message.scrollHeight,
						left: 0,
						behavior: "smooth"
					  })
			});
			socket.emit("findAllUsersInRoom", {uuid: selectedRoom.id}, (users: any) => {
                setMembers(users);
            });
		}
	}, [socket, selectedRoom]);

	socket.on('updateMessages', () => {
		if (selectedRoom && selectedRoom.id !== undefined && selectedRoom.id !== "") {
			socket.emit('findAllMessagesInRoom', { uuid: selectedRoom.id }, (msgs: any) => {
				setMessages(msgs);
				var message = document.getElementById('messages');
				if (message)
					message.scroll({
						top: message.scrollHeight,
						left: 0,
						behavior: "smooth"
					  })
			});
		}
	});

	socket.on('updateRooms', (rooms: any) => {
		console.log('getting information');
		socket.emit('findAllJoinedRooms', (rooms: any) => {
			console.log("findAllJoined", rooms);
			setChannels(rooms)
		});
	});

	async function chooseRoom(thisRoom: Room) {
		console.log("You chose room ", thisRoom);
		setSelectedRoom(thisRoom);
	}

	async function sendMessage() {
		if (selectedRoom.id !== "" && newMessage !== "") {
			console.log('sending message: ', newMessage);
			socket.emit('createMessage', { message: newMessage, roomId: selectedRoom.id });
			setNewMessage("");
			{/*socket.emit('findAllMessagesInRoom', { uuid: selectedRoom.id }, (msgs: any) => {
				setMessages(msgs);
				var message = document.getElementById('messages');
				if (message)
					message.scrollTop = message.scrollHeight;
			});*/}
		}
	}

	return (<div>
		<NavBar />
		<div className="mainComposant">
			<div className="rooms">
				<h3>My Rooms</h3>
				<div className="channel">
					{channels.map((room: Room) => (
						room.name === selectedRoom.name ?
							<li key={room.id} className="selectedRoom" onClick={() => chooseRoom(room)}>{room.name}</li> :
							<li key={room.id} onClick={() => chooseRoom(room)}>{room.name}</li>
					))}
				</div>
				<h3>Members</h3>
				<div className="channel">
					{members.map((member: User) => (
							<li key={member.userUuid}>
								{member.userName}
								<button className='gameInvite'>Invite in Game</button>
							</li>
					))}
				</div>
				<NewAgoraPopup />
				<JoinAgoraPopup />
			</div>
			<div className="chat">
				<ChatSideNav Room={selectedRoom} />
				{
					selectedRoom.bannedTime ?
						<div id="messages">
							<h3>You are banned from this room</h3>
						</div>
						:
						<div id="messages">
							{messages.map((message: any) => (
								<div key={message.id}>
									{message.userName === user.userName ?
										<div className="message_mine">{message.message}</div> :
										<div className="message_other">{message.userName} : {message.message}</div>
									}
								</div>
							))}
						</div>
				}
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
					{selectedRoom.mutedTime ?
						<>
							<input type="text" id="message" name="username"
								value={newMessage}
								placeholder="You are muted"
								onChange={(e: { target: { value: any; }; }) => setNewMessage(e.target.value)}
								autoFocus
								onKeyPress={event => {
									if (event.key === 'Enter') { sendMessage() }
								}}
								minLength={1} />
							<button type="submit" className="mutedButton" onClick={sendMessage}>Send</button>
						</> : <>
							<input type="text" id="message" name="username"
								value={newMessage}
								onChange={(e: { target: { value: any; }; }) => setNewMessage(e.target.value)}
								autoFocus
								onKeyPress={event => {
									if (event.key === 'Enter') { sendMessage() }
								}}
								minLength={1} />
							<button type="submit" onClick={sendMessage}>Send</button>
						</>
					}
				</div>
			</div>
		</div>

	</div>)
}

export default Chat

