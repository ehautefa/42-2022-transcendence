import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "../InvitePopUp/InvitePopUp.css";
import "../ReceivePopUp/ReceivePopUp.css";
import { getSocketPong } from "../../Home";

const socket = getSocketPong();

function ReceivePopUp(modal: any) {

    function close() {
        socket.emit("refuseInvite", modal.modal.matchId);
        document.getElementById("ReceivePopupBackground")!.style.display = "none";
    }

    function joinGame() {
        socket.emit("acceptInvite", modal.modal.matchId, (msg: string) => {
            document.getElementById("ReceivePopupBackground")!.style.display = "none";
            if (msg === "") {
                window.location.href = "/game?id=" + modal.modal.matchId;
            } else {
                alert(msg);
            }

        });

    }

    return (<>
        <div id="ReceivePopupBackground">
            <div id="ReceivePopup">
                <h2 id="rcv-h2">You receive an invitation from {modal.modal.username}</h2>
                <div className="flex-but">
                    <button id="rcv-but" onClick={joinGame}>Join Game</button>
                    <button id="rcv-but" onClick={close}>Close</button>
                </div>
            </div>
        </div>
    </>
    );
}

export default ReceivePopUp;