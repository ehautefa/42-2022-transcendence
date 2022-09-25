import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "../InvitePopUp/InvitePopUp.css";
import "../ReceivePopUp/ReceivePopUp.css";
import { getSocketPong } from "../../App";

const socket = getSocketPong();

function ReceivePopUp(modal: any) {
	
	function refuse() {

		document.getElementById("ReceivePopupBackground")!.style.display = "none"; // close popup
    }
	
    function accept() {
        socket.emit("friendsRequest", modal.modal.matchId);
		document.getElementById("ReceivePopupBackground")!.style.display = "none"; // close popup

    }
	
    return (<>
        <div id="ReceivePopupBackground">
            <div id="ReceivePopup"> 
                <h2 id="rcv-h2">You receive a friend request from {modal.username}</h2>
                <div className="flex-but">
                    <button id="rcv-but" onClick={accept}>Accept</button>
                    <button id="rcv-but" onClick={refuse}>Refuse</button>
                </div>
            </div>
        </div>
    </>
    );
}

export default ReceivePopUp;