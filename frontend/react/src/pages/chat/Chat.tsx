import { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getSocketChat } from "../../App";
import Popup from 'reactjs-popup';
import NavBar from "../../components/NavBar/NavBar";
import "./Chat.css";
//import {Route, NavLink, HashRouter} from 'react-router-dom'
//import { User } from "../../type";

function Chat() {
<<<<<<< HEAD
	const socket = getSocketChat();
	const [open, setOpen] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState("");
	const [messages, setMessages] = useState();
	const [channels, setChannels] = useState([]);

	var userUuid = localStorage.getItem('uid');
	if (userUuid === 'undefined' || userUuid === null)
		userUuid = 'a433d950-3f11-11ed-b878-0242ac120002';
	const [newChannel, setNewChannel] = useState("blaaa");
=======
    const socket = getSocketChat();
    const [open, setOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [messages, setMessages] = useState();
    const [channels, setChannels] = useState([]);
>>>>>>> main

    var userUuid = localStorage.getItem('uid');
    if (userUuid === 'undefined' || userUuid === null)
        userUuid = 'a433d950-3f11-11ed-b878-0242ac120002';
    const [newChannel, setNewChannel] = useState("blaaa");

<<<<<<< HEAD
  	useEffect(() => {
		socket.emit('findAllPublicRooms', (rooms:any) => {setChannels(rooms)});
		
		socket.on('room', (rooms:any) => {
			console.log('getting information');
			setChannels(rooms);
		});
	});

	useEffect(() => {
		socket.emit('getAllMessagesInRoom', selectedRoom, (msgs:any) => {
			setMessages(msgs)});
	}, [selectedRoom, socket]);

	function makeRoom() {
		console.log('creating room ', newChannel);
		socket.emit('createRoom', { name: newChannel, ownerId: userUuid, 
			isProtected:false, password: "", type: 'public', 
			userId:userUuid 
		});
		console.log(channels);
		setOpen(false);
	}
	
	
	return ( <div>
		<NavBar />
		<div className="mainComposant">
			<div className="box">
			<button type="submit" onClick={() => setOpen(true)}> New </button>
			<Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);
=======

    useEffect(() => {
        socket.emit('findAllPublicRooms', (rooms:any) => {setChannels(rooms)});
        
        socket.on('room', (rooms:any) => {
            console.log('getting information');
            setChannels(rooms);
        });
    });

    useEffect(() => {
        socket.emit('getAllMessagesInRoom', selectedRoom, (msgs:any) => {
            setMessages(msgs)});
    }, [selectedRoom, socket]);

    function makeRoom() {
        console.log('creating room ', newChannel);
        socket.emit('createRoom', { name: newChannel, ownerId: userUuid, 
            isProtected:false, password: "", type: 'public', 
            userId:userUuid 
        });
        console.log(channels);
        setOpen(false);
    }
    
    
    return ( <div>
        <NavBar />
        <div className="mainComposant">
            <div className="box">
            <button type="submit" onClick={() => setOpen(true)}> New </button>
            <Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);
>>>>>>> main
             window.location.reload();
            }}>
            <div className='messagePopup'>
                <label htmlFor="messagePopup">Message to :</label>
                <div className='input-flex'>
                    <input type="text" id="messagePopup" name="username"
                        value={newChannel}
                        onChange={(e) => setNewChannel(e.target.value)}
                        autoFocus
                        autoCorrect="off"
                        placeholder="..."
                        minLength={1}
                        maxLength={30}
                        size={30} />
                    <span></span>
                </div>
                <button type="submit" onClick={makeRoom}>Save</button>
            </div>
<<<<<<< HEAD
        	</Popup>

				<div className="channel">
				{channels.map((room:any) => (
						<li key = {room.name} onClick={() => setSelectedRoom(room.name)}>{room.name}</li>
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
=======
            </Popup>

                <div className="channel">
                {channels.map((room:any) => (
                        <li key = {room.name} onClick={() => setSelectedRoom(room.name)}>{room.name}</li>
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
>>>>>>> main

    </div>)
}

export default Chat

