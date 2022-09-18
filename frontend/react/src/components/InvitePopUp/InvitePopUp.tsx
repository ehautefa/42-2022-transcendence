import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "./InvitePopUp.css";
import Popup from 'reactjs-popup';
import { useState } from "react";
import { getSocketPong } from "../../App"

const socket = getSocketPong();

function InvitePopUp(arg: any) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState("");

    function invitePlayer() {
        setOpen(true);
        console.log("invitePlayer", arg.userName);
        socket.emit("invitePlayer", {
            userName: arg.user.userName,
            userUuid: arg.user.userUuid,
            invitedUserName: arg.userName,
        }, (matchId: string) => {
            console.log("MATCH ID", matchId);
            setId(matchId);
        });
    }

    return (
        <>
            <div className="Popup-mother">
                <button className="invite" onClick={invitePlayer}>invite</button>
                <Popup open={open} closeOnDocumentClick onClose={() => { setOpen(false); }}>
                    <div className='invitePlayer'>
                        <h2>Your invitation has been sent</h2>
                        <a href={"./game?id=" + id}>Join Game</a>
                    </div>
                </Popup>
            </div>
        </>
    );
}

export default InvitePopUp;