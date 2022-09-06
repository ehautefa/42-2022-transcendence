import NavBar from "../../components/NavBar/NavBar"
import "./Chat.css"
import { useState } from 'react'
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import {Route, NavLink, HashRouter} from 'react-router-dom'


function Chat() {
	var message: string;
	const [messages, setMessages] = useState([""]);
	const handleChange = (event:any) => {
		console.log("Message 'ecrit' : ", message);
		message = event.target.value;
	}

	const sendMessage = (event:any) => {
		event.preventDefault();
		if (message) {
			console.log("Message a envoyer : ", message);
			// socket.emit("message", socket.id + ": " + message);
			setMessages(prevValues => [...prevValues, message]);
			message = "";
		}
		event.target.reset();
	}

	
	return ( <div>
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
				<form onSubmit={sendMessage}>
					<input
						id="input"
						autoComplete="off"
						type="text"
						onChange={handleChange}
						autoFocus
					/>
					<button type="submit">
						Send
					</button>
				</form>
			</div>
		</div>

	</div>)
}

export default Chat


{/*

		<HashRouter>
			


		</HashRouter>




<div>
<h1>Simple SPA</h1>
<ul className="header">
  <li><NavLink to="/">Home</NavLink></li>
  <li><NavLink to="/stuff">Stuff</NavLink></li>
  <li><NavLink to="/contact">Contact</NavLink></li>
</ul>
<div className="content">
  <Route path="/" component={Home}/>
  <Route path="/stuff" component={Stuff}/>
  <Route path="/contact" component={Contact}/>
</div>
</div>



*/}