import "./EditUsernamePopUp.css";
import Popup from 'reactjs-popup';
import { useState } from "react";
import { ChangeUsername } from "../../pages/myProfile/request";

function EditUsernamePopUp() {
    const [open, setOpen] = useState(false);
    const [newUsername, setNewUsername] = useState("");

    async function SaveUserName() {
        if (newUsername.length > 3 // min length of username is 4
            && newUsername.length < 12 // max length of username is 12
            && newUsername.match(/^[a-zA-Z0-9]+$/)) { // only alphanumeric characters
                let ret = await ChangeUsername(newUsername);
                if (ret !== null) {
                    setNewUsername("");
                    setOpen(false);
                }
        } else {
            alert("Username must be between 4 and 12 characters and alphanumeric");
        }
    }

    return (<div className="Popup-mother">
        <button className="Edit" onClick={() => setOpen(true)}>edit</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {setOpen(false);
            }}>
            <div className='editUsername'>
                <label htmlFor="editUsername">New username :</label>
                <div className='input-flex'>
                    <input type="text" id="editUsername" name="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                        autoFocus
                        autoCorrect="off"
                        placeholder="Username"
                        minLength={4}
                        maxLength={12}
                        size={12} />
                    <span></span>
                </div>
                <button type="submit" onClick={SaveUserName}>Save</button>
            </div>
        </Popup>
        </div>);
}

export default EditUsernamePopUp;