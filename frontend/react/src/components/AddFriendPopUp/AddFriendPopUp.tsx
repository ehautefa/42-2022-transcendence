import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "../InvitePopUp/InvitePopUp.css";
import "../ReceivePopUp/ReceivePopUp.css";
import { getSocketStatus } from "../../App";

const socketStatus = getSocketStatus();

function ReceivePopUp(modal: any) {
	var response : any = {
        "accept" : true,
        "inviter" : modal.modal.inviter
    }
	function refuse() {
        response.accept = false;
        socketStatus.emit("addFriendResponse", response);
		document.getElementById("ReceivePopupBackground")!.style.display = "none"; // close popup
    }
	
    function accept() {
        socketStatus.emit("addFriendResponse", response);
		document.getElementById("ReceivePopupBackground")!.style.display = "none"; // close popup
    }
	
    return (<>
        <div id="ReceivePopupBackground">
            <div id="ReceivePopup"> 
                <h2 id="rcv-h2">You receive a friend request from {modal.inviter}</h2>
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