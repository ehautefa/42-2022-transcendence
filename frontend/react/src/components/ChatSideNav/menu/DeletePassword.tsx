import { useState } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import { getSocketChat } from "../../../App";


function DeletePassword({ room }: any) {
    const socket = getSocketChat();
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");

    const Yes = (e: any) => {
        e.preventDefault();
        console.log('set password ', password);
        // TO DO : send password to backend
        let param = {
            roomId: room.id,
            password: password,
            newPassword: ""
        }
		socket.emit('changePassword', param);
        setOpen(false);
    }

    function No() {
        setOpen(false);
    }


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>Delete Password</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {
            setOpen(false);
        }}>
            <div className='side-menu-popup'>
                <input type="password" id="messagePopup" name="password"
                    onChange={(e: { target: { value: any; }; }) => setPassword(e.target.value)}
                    autoFocus
                    autoCorrect="off"
                    placeholder="Old password"
                    minLength={1}
                    maxLength={30}
                    size={30} />
                <h3>Are you sure you want to delete the passsword of the room {room.name} ?</h3>
                <div className="flex-button-popup">
                    <button onClick={No}>No</button>
                    <button onClick={Yes}>Yes</button>
                </div>
            </div>
        </Popup>
    </div>);
}

export default DeletePassword;