import "./Popup.css";
import Popup from 'reactjs-popup';
import { useState } from "react";
import { ChangeUsername } from "../../pages/myProfile/request";

function PopupEditUsername() {
    const [open, setOpen] = useState(false);
    const [newUsername, setNewUsername] = useState("");

    function SaveUserName() {
        if (newUsername.length > 3 // min length of username is 4
            && newUsername.length < 8 // max length of username is 8
            && newUsername.match(/^[a-zA-Z0-9]+$/)) { // only alphanumeric characters
            setOpen(false);
	        const uid = localStorage.getItem('uid');
            if (uid) 
                ChangeUsername(uid, newUsername);
        } else {
            alert("Username must be between 4 and 8 characters and alphanumeric");
        }

    }

    return (<>
        <button className="Edit" onClick={() => setOpen(true)}>( edit )</button>
        <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
            <div className='editUsername'>
                <label htmlFor="editUsername">UserName (4 to 8 characters):</label>
                <div className='input-flex'>
                    <input type="text" id="editUsername" name="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                        autoFocus
                        autoCorrect="off"
                        placeholder="Username"
                        minLength={4}
                        maxLength={8}
                        size={10} />
                    <span></span>
                </div>
                <button type="submit" onClick={SaveUserName}>Save</button>
            </div>
        </Popup>
        </>);
}

export default PopupEditUsername;