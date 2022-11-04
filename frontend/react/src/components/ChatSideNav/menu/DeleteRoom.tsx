import { useState } from "react";
import Popup from "reactjs-popup";
import { getSocketChat } from "../../../Home";
import "./sideMenu.css";

function DeleteRoom({ room }: any) {
	const socket = getSocketChat();
    const [open, setOpen] = useState(false);

    function Yes() {
        setOpen(false);
        if (room && room !== undefined && room.id !== undefined) {
            socket.emit('deleteRoom', {uuid: room.id});
        }
    }

    function No() {
        setOpen(false);
    }


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>Delete Room</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {
            setOpen(false);
        }}>
            <div className='side-menu-popup'>
                <h3>Are you sure you want to delete the room {room.name} ?</h3>
                <div className="flex-button-popup">
                    <button onClick={No}>No</button>
                    <button onClick={Yes}>Yes</button>
                </div>
            </div>
        </Popup>
    </div>);
}

export default DeleteRoom;