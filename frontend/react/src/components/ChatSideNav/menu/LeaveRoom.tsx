import { useState } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import { getSocketChat } from "../../../App";


function LeaveRoom({ room }: any) {
    const socket = getSocketChat();
    const [open, setOpen] = useState(false);

    function Yes() {
        socket.emit('leaveRoom', {uuid: room.id})
        room = {};
        setOpen(false);
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
                <h3>Are you sure you want to leave the room {room.name} ?</h3>
                <div className="flex-button-popup">
                    <button onClick={No}>No</button>
                    <button onClick={Yes}>Yes</button>
                </div>
            </div>
        </Popup>
    </div>);
}

export default LeaveRoom;