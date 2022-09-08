import "../EditUsernamePopUp/EditUsernamePopUp.css";
import "../InvitePopUp/InvitePopUp.css";
import "../ReceivePopUp/ReceivePopUp.css";
import Popup from 'reactjs-popup';
import { useState } from "react";
// import { usePopup, PopupContextType } from './pop UpContext'

// const ReceivePopUp = () => {
//     const res = usePopup()
//     const { value } = res as PopupContextType;

//     return value ? <div>{value}</div> : null
// }

// export default ReceivePopUp

function ReceivePopUp() {
    const [id, setId] = useState(0);

    function closePopup() {
        document.getElementById("ReceivePopup")!.style.display = "none";
    }

    return (<>
        <div id="ReceivePopup">
            <h2>You receive an invitation from </h2>
            <button onClick={closePopup}>Close</button>
            <a href={"./game?id=" + id}>Join Game</a>
        </div>
    </>
    );
}

export default ReceivePopUp;