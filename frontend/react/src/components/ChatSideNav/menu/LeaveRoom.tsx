import { useState } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import { getSocketChat } from "../../../App";


function LeaveRoom({name} : any) {
    const socketChat = getSocketChat();
    const [open, setOpen] = useState(false);

    function Yes() {
        setOpen(false);
        // TO DO : Add a event leave room
    }

    function No() {
        setOpen(false);
    }


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>Leave Room</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {
            setOpen(false);
        }}>
            <div className='side-menu-popup'>
                <h3>Are you sure you want to leave the room {name} ?</h3>
                <button className="flex-button-popup" onClick={No}>No</button>
                <button className="flex-button-popup" onClick={Yes}>Yes</button>
            </div>
        </Popup>
    </div>);
}

export default LeaveRoom;