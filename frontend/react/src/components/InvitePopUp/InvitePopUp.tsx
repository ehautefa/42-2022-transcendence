import "../Popup/Popup.css";
import "./InvitePopUp.css";
import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocket } from "../../App"

const socket = getSocket();

function InvitePopUp(arg: any) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    
	function invitePlayer() {
        setOpen(true);
        console.log("invitePlayer", arg.userUuid);
        socket.emit("invitePlayer", {
            userName: arg.user.userName,
            userUuid: arg.user.userUuid,
            invitedUid: arg.userUuid,
            id: 0
        }, (id: number) => {
            console.log("ID", id);
            setId(id);
        });
	}

    return (<div className="Popup-mother">
        <button className="invite" onClick={invitePlayer}>invite</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);}}>
            <div className='invitePlayer'>
                <h2>Your invitation has been sent</h2>
				<a href={"./game?id=" + id}>Join Game</a>
            </div>
        </Popup>
        </div>);
}

export default InvitePopUp;