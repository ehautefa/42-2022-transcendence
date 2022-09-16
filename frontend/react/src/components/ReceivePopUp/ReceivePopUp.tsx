import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "../InvitePopUp/InvitePopUp.css";
import "../ReceivePopUp/ReceivePopUp.css";
import {getSocket} from "../../App";
import { useContext } from "react";

const socket = getSocket();

function ReceivePopUp(modal: any) {
	
	function closePopup() {
		document.getElementById("ReceivePopupBackground")!.style.display = "none";
    }
	
    function joinGame() {
		let arg = {
            "userUuid": localStorage.getItem('uid'),
            "userName": localStorage.getItem('userName'),
            "id": modal.modal.id
        }
        socket.emit("acceptInvite", arg);
        closePopup();
		// navigate to game with good id
        window.history.pushState({}, "", "/game?id=" + modal.modal.id);
        window.location.reload();
    }
	
    return (<>
        <div id="ReceivePopupBackground">
            <div id="ReceivePopup"> 
                <h2 id="rcv-h2">You receive an invitation from {modal.username}</h2>
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