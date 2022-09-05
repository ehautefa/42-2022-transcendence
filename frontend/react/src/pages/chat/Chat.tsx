import NavBar from "../../components/NavBar/NavBar"
import "./Chat.css"
import { useState } from 'react'
import {
	CSSTransition,
	TransitionGroup,
  } from 'react-transition-group';
function Chat() {
	var message: string;
	const [messages, setMessages] = useState([""]);
	const handleChange = (event:any) => {
		console.log("Message 'ecrit' : ", message);
		message = event.target.value;
	}

	const sendMessage = (event:any) => {
		if (message) {
			console.log("Message a envoyer : ", message);
			// socket.emit("message", socket.id + ": " + message);
			setMessages(prevValues => [...prevValues, message]);
			message = "";
		}
	}


	return (<div>
		<NavBar />
		<div className="mainComposant">
			<div className="box">
				<div className="channel">
					<h3>Channel</h3>
				</div>
				<div className="channel">
					<h3>Members</h3>
				</div>
			</div>
			<div className="chat">
				<TransitionGroup className="messages">
					{messages.map((message: string) => (
						<CSSTransition
						key={message}
						timeout={500}
						classNames="fade"
						>
						<li>{message}</li>
						</CSSTransition>
					))}
				</TransitionGroup>
				<form id="form" action="">
					<input
						id="input"
						autoComplete="off"
						type="text"
						onChange={handleChange}
						autoFocus
					/>
					<button type="reset" onClick={sendMessage}>
						Send
					</button>
				</form>
			</div>
		</div>
	</div>)
}

export default Chat