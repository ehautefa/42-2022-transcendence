import { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getSocketChat } from "../../App";
import NavBar from "../../components/NavBar/NavBar";
import "./Chat.css";
//import {Route, NavLink, HashRouter} from 'react-router-dom'
//import { User } from "../../type";

function Chat() {
	const socket = getSocketChat();
	var selectedRoom = "";
	const [messages, setMessages] = useState();
	socket.emit('getAllMessagesInRoom', selectedRoom, (msgs:any) => {
		setMessages(msgs);
	});
	
	const [channels, setChannels] = useState([]);
	const userUuid = localStorage.getItem('uid');
	const [newChannel, setNewChannel] = useState("blaaaa");


  	useEffect(() => {
		socket.emit('findAllPublicRooms', (rooms:any) => {setChannels(rooms)});

		socket.on('room', (rooms:any) => {
			console.log('getting information');
			setChannels(rooms);
		});
	});

	function makeRoom() {
		console.log('creating room ', newChannel);
		socket.emit('createRoom', {
			name: newChannel,
			ownerId: userUuid, 
			isProtected:false, 
			password: "", 
			type: 'public', 
			userId:userUuid 
		});
		console.log(channels);
	}

	function selectRoom(name: string) {
		console.log('Selected room ', name);
		selectedRoom = name;
		socket.emit('getAllMessagesInRoom', name, (msgs:any) => {
			setMessages(msgs);
		});
	}
	
/* 	const handleChange = (event:any) => { message = event.target.value;	}

	const sendMessage = (event:any) => {
		event.preventDefault();
		if (message) {
			console.log("Message a envoyer : ", message);
			// socket.emit("message", socket.id + ": " + message);
			setMessages(prevValues => [...prevValues, {msg: message, who_said: "me"}]);
			if (message.search(/possible/gi) !== -1 || message.search(/can /gi) !== -1)
				setMessages(prevValues => [...prevValues, {msg: "NO WAY!", who_said: "God"}]);
			message = "";
		}
		event.target.reset();
	} */
	
	return ( <div>
		<NavBar />
		<div className="mainComposant">
			<div className="box">
			<button type="submit" onClick={makeRoom}> New </button>
				<div className="channel">
				{channels.map((room:any) => (
						<li key = {room.name} onClick={() => selectRoom(room.name)}>{room.name}</li>
					))}
				</div>
			</div>
			<div className="chat">
				<TransitionGroup className="messages">
					{messages ? (messages as any).map((message:any) => (
						message.sender.userUuid === userUuid ? 
						(<CSSTransition key={message} timeout={500} classNames="fade">
						<div className="message_mine">me: {message}</div>
						</CSSTransition>) : (<CSSTransition key={message} timeout={500} classNames="fade">
						<div className="message_mine">{message.sender.userName}: {message}</div>
						</CSSTransition>))
					) : null
					}
				</TransitionGroup>
				<form onSubmit={makeRoom}>
					<input
						autoComplete="off"
						type="text"
						onChange={makeRoom}
						autoFocus
					/>
					<button type="submit"> Send </button>
				</form>
			</div>
		</div>

	</div>)
}

export default Chat
