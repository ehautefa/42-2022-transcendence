import NavBar from "../../components/NavBar/NavBar"
import "./Chat.css"
import { useState } from 'react'
import Popup from 'reactjs-popup';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import {Route, Link, HashRouter} from 'react-router-dom'


function ChatPopups() {
	var message: string;
	var channel: string;
    channel = " ";
	const [messages, setMessages] = useState([""]);
	const [channels, setChannels] = useState([""]);
    const [open, setOpen] = useState(false);
	return (<div className="Popup-mother">
    <button className="Edit" onClick={() => setOpen(true)}>( edit )</button>
    <Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);
         window.location.reload();
        }}>
        <div className='editUsername'>
            <label htmlFor="editUsername">New username :</label>
            <div className='input-flex'>
                <input type="text" id="editUsername" name="username"
                    value={channel}
                    onChange={(e) => setChannels((prevValues => [...prevValues, channel]))}
                    required
                    autoFocus
                    autoCorrect="off"
                    placeholder="Username"
                    minLength={4}
                    maxLength={8}
                    size={10} />
                <span></span>
            </div>
            <button type="submit">Save</button>
        </div>
    </Popup>
    </div>);
}

export default ChatPopups
