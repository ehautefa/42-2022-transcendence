import { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getSocketChat } from "../../App";
import NavBar from "../../components/NavBar/NavBar";
import "./Chat.css";
//import {Route, NavLink, HashRouter} from 'react-router-dom'
//import { User } from "../../type";

function Chat() {
	const socket = getSocketChat();

	console.log(socket);

	var message: string;
	const [messages, setMessages] = useState([{msg: "", who_said: ""}]);
	
	const [channels, setChannels] = useState([]);
	const userUuid = localStorage.getItem('uid');
	const [newChannel, setNewChannel] = useState("blablae");


  	useEffect(() => {
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
		socket.emit('findAllPublicRooms', (rooms:any) => {setChannels(rooms)});
		console.log(channels);
	}
	
	const handleChange = (event:any) => { message = event.target.value;	}

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
	}

	return ( <div>
		<NavBar />
		<div className="mainComposant">
			<div className="box">
			<button type="submit" onClick={makeRoom}> New Channel </button>
				<div className="channel">
				{channels.map((room:any) => (
						<li>{room.name}</li>
					))}
				</div>
			</div>
			<div className="chat">
				<TransitionGroup className="messages">
					{messages.map(({msg: message, who_said: who}) => (
						who === "me" ? 
						(<CSSTransition key={message} timeout={500} classNames="fade">
						<div className="message_mine">{who}: {message}</div>
						</CSSTransition>) : (<CSSTransition key={message} timeout={500} classNames="fade">
						<div className="message_other">{who}: {message}</div>
						</CSSTransition>) 
					))}
				</TransitionGroup>
				<form onSubmit={sendMessage}>
					<input
						autoComplete="off"
						type="text"
						onChange={handleChange}
						autoFocus
					/>
					<button type="submit"> Send </button>
				</form>
			</div>
		</div>

	</div>)
}

export default Chat
