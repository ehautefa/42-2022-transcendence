import { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { User } from "../../type";
import { getSocketChat, getSocketStatus } from "../../App";
import NavBar from "../../components/NavBar/NavBar";
import NewDMPopup from "./NewDMPopup";
import JoinAgoraPopup from "./JoinAgoraPopup";
import NewAgoraopup from "./NewAgoraPopup";
import {getMe} from "../myProfile/request"
import "./Chat.css";

//import {Route, NavLink, HashRouter} from 'react-router-dom'
//import { User } from "../../type";

const socketStatus = getSocketStatus();

socketStatus.on('getUserUuid', () => {
	socketStatus.emit('getUserUuid');
})

function Chat() {
    const socket = getSocketChat();
	const emptyUser: User = { userUuid: "", userName: "" };
	const [user, setUser] = useState(emptyUser);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [messages, setMessages] = useState();
    const [channels, setChannels] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	async function fetchUser() {
		const user = await getMe();
		setUser(user);
	}

	useEffect(() => {
		fetchUser();
		socket.emit('findAllPublicRooms', (rooms:any) => {setChannels(rooms)});
	}, [socket]);

	useEffect(() => {
        socket.on('updateMessages', (rooms:any) => {
            console.log('getting information');
            socket.emit('findAllMessagesInRoom', {uuid: selectedRoom, }, (msgs:any) => {
				setMessages(msgs)});
        });
		socket.on('updateRooms', (rooms:any) => {
            console.log('getting information');
			socket.emit('findAllPublicRooms', (rooms:any) => {setChannels(rooms)});
        });
	});


	async function chooseRoom(thisRoom : string){ 
		console.log ("You chose room ", thisRoom);
		await setSelectedRoom(thisRoom);
	}
    
	function sendMessage()
	{
		console.log('sending message: ', newMessage);
		socket.emit('createMessage', {message: newMessage, roomId: selectedRoom});
		setNewMessage("");
	}
    
    return ( <div>
        <NavBar />
        <div className="mainComposant">
			<div className="rooms">
				<NewDMPopup />
				<div className="channel">
				{channels.map((room:any) => (
						<li key = {room.name} onClick={() => chooseRoom(room.id)}>{room.name}</li>
					))}
				</div>
			</div>
            <div className="chat">
                <TransitionGroup className="messages">
                    {messages ? (messages as any).map((message:any) => (
                        message.sender.userUuid === user.userUuid ? 
                        (<CSSTransition key={message} timeout={500} classNames="fade">
                        <div className="message_mine">me: {message}</div>
                        </CSSTransition>) : (<CSSTransition key={message} timeout={500} classNames="fade">
                        <div className="message_mine">{message.sender.userName}: {message}</div>
                        </CSSTransition>))
                    ) : null
                    }
                </TransitionGroup>
				<div className='input-flex'>
					<input type="text" id="message" name="username"
						value={newMessage}
						onChange={(e: { target: { value: any; }; }) => setNewMessage(e.target.value)}
						autoFocus
						onKeyPress={event => {
							if (event.key === 'Enter') {sendMessage()}
						}}
						minLength={1} />
				</div>
				<button type="submit" onClick={sendMessage}>Send</button>
            </div>
        </div>

    </div>)
}

export default Chat

