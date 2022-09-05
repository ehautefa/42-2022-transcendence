import "../Popup/Popup.css";
import "../InvitePopUp/InvitePopUp.css";
import Popup from 'reactjs-popup';
import { useState } from "react";

function ReceivePopUp(arg: any) {
    const [open, setOpen] = useState(true);
    const [id, setId] = useState(0);
    

    return (<div className="Popup-mother">
        {/* <button className="invite" onClick={invitePlayer}>invite</button> */}
        <Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);}}>
            <div className='invitePlayer'>
                <h2>You receive an invitation from </h2>
                <button onClick={() => setOpen(false)}>Close</button>
				<a href={"./game?id=" + id}>Join Game</a>
            </div>
        </Popup>
        </div>);
}

export default ReceivePopUp;