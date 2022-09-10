import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "../InvitePopUp/InvitePopUp.css";
import "../ReceivePopUp/ReceivePopUp.css";
import Popup from 'reactjs-popup';
import { useState } from "react";
import {getSocket} from "../../App";

const socket = getSocket();

function ReceivePopUp(arg:any) {
    console.log("RECEIVE POP UP", arg);
    const [id, setId] = useState(0);

    function closePopup() {
        document.getElementById("ReceivePopupBackground")!.style.display = "none";
    }

    function joinGame() {
        let arg = {
            "userUuid": localStorage.getItem('uid'),
            "userName": localStorage.getItem('userName'),
            "id": id
        }
        socket.emit("acceptInvite", arg);
        closePopup();
        
    }

    return (<>
        <div id="ReceivePopupBackground">
            <div id="ReceivePopup"> 
                <h2 id="rcv-h2">You receive an invitation from</h2>
                <div className="flex-but">
                    <button id="rcv-but" onClick={joinGame}>Join Game</button>
                    <button id="rcv-but" onClick={closePopup}>Close</button>
                </div>
            </div>
        </div>
    </>
    );
}

export default ReceivePopUp;