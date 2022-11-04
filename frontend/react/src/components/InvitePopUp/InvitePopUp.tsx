import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "./InvitePopUp.css";
import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocketPong } from "../../App"
import { Link } from "react-router-dom";

const socket = getSocketPong();

function InvitePopUp(arg: any) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState("");

    function invitePlayer() {
        setOpen(true);
        socket.emit("invitePlayer", {
            userName: arg.user.userName,
            userUuid: arg.user.userUuid,
            invitedUserName: arg.userName,
			invitedUserUuid: arg.userUuid
        }, (matchId: string) => {
            setId(matchId);
        });
    }

    return (
        <>
            <div className="Popup-mother">
                <button className="invite" onClick={invitePlayer}>Pong invite</button>
                <Popup open={open} closeOnDocumentClick onClose={() => { setOpen(false); }}>
                    <div className='invitePlayer'>
                        <h2>Your invitation has been sent</h2>
                        <Link to={"/game?id=" + id}>Join Game</Link>
                    </div>
                </Popup>
            </div>
        </>
    );
}

export default InvitePopUp;