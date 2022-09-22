import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "../InvitePopUp/InvitePopUp.css";
import "../ReceivePopUp/ReceivePopUp.css";
import { getSocketPong } from "../../App";

const socket = getSocketPong();

function ReceivePopUp(modal: any) {
	
	function closePopup() {
		document.getElementById("ReceivePopupBackground")!.style.display = "none";
    }
	
    function joinGame() {
        socket.emit("acceptInvite", {matchId: modal.modal.matchId});
        closePopup();
		// navigate to game with good id
        window.history.pushState({}, "", "/game?id=" + modal.modal.matchId);
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