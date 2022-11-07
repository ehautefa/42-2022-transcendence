import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getSocketChat } from "../../Home";
import ChatSideNav from "../../components/ChatSideNav/ChatSideNav";
import InvitePopUp from '../../components/InvitePopUp/InvitePopUp';
import NavBar from "../../components/NavBar/NavBar";
import { Room, User } from "../../type";
import { getMe } from "../myProfile/request";
import "./Chat.css";
import JoinAgoraPopup from "./JoinAgoraPopup";
import NewAgoraPopup from "./NewAgoraPopup";

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
				let tofindRoom: Room = rooms.find((room: Room) => room.id === roomId);
				if (tofindRoom !== undefined) {
					setSelectedRoom(tofindRoom);
				}
				window.history.replaceState({}, document.title, "/chat");
			}
		});
	}, [socket, roomId]);

	useEffect(() => {
		var message = document.getElementById('messages');
		if (message)
			message.scroll({
				top: message.scrollHeight,
				left: 0,
				behavior: "smooth"
			})
	}, [messages]);

	useEffect(() => {
		if (selectedRoom && selectedRoom.id !== undefined && selectedRoom.id !== "") {
			socket.emit('findAllMessagesInRoom', { uuid: selectedRoom.id }, (msgs: any) => {
				setMessages(msgs);
				console.log("findAllMessagesInRoom", msgs);
			});
			socket.emit("findAllUsersInRoom", { uuid: selectedRoom.id }, (users: any) => {
				setMembers(users);
			});
		}
		socket.on('updateMessages', (updatedRoom: any) => {
			if (selectedRoom && selectedRoom.id !== undefined
				&& selectedRoom.id !== "" && selectedRoom.id === updatedRoom) {
				socket.emit('findAllMessagesInRoom', { uuid: selectedRoom.id }, (msgs: any) => {
					setMessages(msgs);
				});
			}
		});

		function refreshOneRoom() {
			setSelectedRoom({} as Room);
			socket.emit('findAllJoinedRooms', (rooms: any) => {
				console.log("findAllJoined", rooms);
				setChannels(rooms)
			});
		}
		socket.on('refreshSelectedRoom', refreshOneRoom);

		return () => {
			socket.removeListener('refreshSelectedRoom', refreshOneRoom);
			socket.off('updateMessages');
		}
	}, [socket, selectedRoom]);

	useEffect(() => {
		function updateRooms() {
			console.log('getting information');
			socket.emit('findAllJoinedRooms', (rooms: Room[]) => {
				console.log("findAllJoined", rooms);
				setChannels(rooms);
				if (selectedRoom && selectedRoom.id !== undefined && selectedRoom.id !== "") {
					console.log("room before: ", selectedRoom);
					let aux = rooms.find(obj => { return obj.id === selectedRoom.id});
					if (aux !== undefined && aux !== null){
						setSelectedRoom(aux);
						console.log("got in");
					}
					console.log("room after: ", selectedRoom);
					socket.emit("findAllUsersInRoom", { uuid: selectedRoom.id }, (users: any) => {
						setMembers(users);
					});
				}
			});
		};
		socket.on('updateRooms', updateRooms);
		return() => {
			socket.removeListener('updateRooms', updateRooms);
		}
	}, [socket, selectedRoom, channels]);

	async function chooseRoom(thisRoom: Room) {
		console.log("You chose room ", thisRoom);
		setSelectedRoom(thisRoom);
	}

	async function sendMessage() {
		if (selectedRoom.id !== "" && newMessage !== "") {
			console.log('sending message: ', newMessage);
			socket.emit('createMessage', { message: newMessage, roomId: selectedRoom.id });
			setNewMessage("");
		}
	}
	function rightName(room: Room) {
		if (room.type === "dm") {
			if (room.name === null)
				room.name = "olozano-ehautefa";
			var start = room.name.indexOf(user.userName);
			var end = start + user.userName.length;
			return room.name.substring(0, start) + room.name.substring(end);
		}
		return room.name;
	}

	return (<div>
		<NavBar />
		<div className="mainComposant">
			<div className="rooms">
				<h3>My Rooms</h3>
				<div className="channel">
					{channels
					.sort((a,b) => rightName(a).toLowerCase() > rightName(b).toLowerCase() ? 1 : -1)
					.map((room: Room) => (

						// .sort((a, b) => a.itemM > b.itemM ? 1 : -1)
						room.id === selectedRoom.id ?
							<li key={room.id} className="selectedRoom" onClick={() => chooseRoom(room)}>{rightName(room)}</li> :
							<li key={room.id} onClick={() => chooseRoom(room)}>{rightName(room)}</li>
					))}
				</div>
				<h3>Members</h3>
				<div className="channel members">
					{members.map((member: User) => (
						<li key={member.userUuid}>
							<Link to={"/profile?uid=" + member.userUuid}>{member.userName}</Link>
							<InvitePopUp userName={member.userName} userUuid={member.userUuid} user={user} />
						</li>
					))}
				</div>
				<NewAgoraPopup />
				<JoinAgoraPopup />
			</div>
			{selectedRoom.id !== undefined && selectedRoom.id !== "" &&
				<div className="chat">
					{
						selectedRoom.type !== "dm" &&
						<ChatSideNav Room={selectedRoom}  />
					}
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
											<div className="message_mine">
												<div className="message-box">{message.message}</div>
												<p>{new Date(message.time).getHours() + ":" + new Date(message.time).getMinutes()}</p>
											</div> :
											<div className="message_other">
												<div className='message-box'>
													<h5>{message.userName}</h5>
													<p>{message.message}</p>
												</div>
												<p>{new Date(message.time).getHours() + ":" + new Date(message.time).getMinutes()}</p>
											</div>
										}
									</div>
								))}
							</div>
					}
					<div className='input-flex'>
						{selectedRoom.mutedTime ?
							<>
								<input type="text" id="message" name="username"
									value={newMessage}
									placeholder="You are muted"
									onChange={(e: { target: { value: any; }; }) => setNewMessage(e.target.value)}
									autoFocus
									onKeyPress={event => {
										if (event.key === 'Enter') { }
									}}
									minLength={1} />
								<button type="submit" className="mutedButton">Send</button>
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
			}
		</div>

	</div>)
}

export default Chat

