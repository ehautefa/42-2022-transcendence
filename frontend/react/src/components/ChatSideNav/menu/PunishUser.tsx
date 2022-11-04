import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import { getSocketChat } from "../../../Home";
import Select from "react-select";
import { SelectClass } from "./SelectClass"
import { Room } from "../../../type";

function PunishUser(param: any) {
    const socket = getSocketChat();
    const [open, setOpen] = useState(false);
    const [newPunish, setNewPunish] = useState("");
    const [users, setUsers] = useState([] as SelectClass[]);
    const [duration, setDuration] = useState(0);

    let room: Room = param.room;
    let ban: boolean = param.ban;

    useEffect(() => {
        if (room.id !== "") {

            let param = {
                roomId: room.id,
                isAdmin: false
            }
            socket.emit("filterByAdminRightsInRoom", param, (users: any) => {
                let selectTab: SelectClass[] = users.map((user: any) => new SelectClass(user.user));
                setUsers(selectTab);
            });
        }
    }, [room, ban, socket]);

    const handleChange = (newValue: any) => {
        setNewPunish(newValue.value);
    }


    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            color: '#FA0197',
            borderTop: '1px solid #DBACE3',
            boxShadow: '0px 0px 20px #7C4D84',
            backgroundColor: 'rgba(0, 0, 0, 1)',
            padding: 10,
        }),
        control: (styles: any) => ({
            ...styles,
            color: '#FA0197',
            border: '1px solid #DBACE3',
            boxShadow: '0px 0px 10px #7C4D84',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 1)',
            padding: 5,
            margin: 40
        }),
        input: (styles: any) => ({
            ...styles,
            color: '#FA0197',
        }),
        singleValue: (styles: any) => ({
            ...styles,
            color: '#FA0197',
        }),
        noOptionsMessage: (styles: any) => ({
            ...styles,
            color: '#FA0197',
            border: '1px solid #DBACE3',
            boxShadow: '0px 0px 10px #7C4D84',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 1)',
            padding: 5,

        }),

    }

    function Submit() {
        let param = {
            userId: newPunish,
            roomId: room.id,
            duration: duration,
            isBanned: ban
        }
        socket.emit('punishUser', param);
        setOpen(false);
    }


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>
            {
                ban ?
                    "Ban user" :
                    "Mute user"
            }
        </button>
        <Popup open={open} closeOnDocumentClick onClose={() => {
            setOpen(false);
        }}>
            <div className='side-menu-popup'>
                <h3>Select Users</h3>
                <Select
                    onChange={handleChange}
                    styles={customStyles}
                    options={users} />
                <input type="text" id="messagePopup" name="password"
                    onChange={(e: { target: { value: any; }; }) => setDuration(e.target.value)}
                    autoFocus
                    autoCorrect="off"
                    placeholder="Duration"
                    minLength={1}
                    maxLength={30}
                    size={30} />
                {
                    ban ?
                        <button onClick={Submit}>Ban user</button> :
                        <button onClick={Submit}>Mute user</button>
                }
            </div>
        </Popup>
    </div>);
}

export default PunishUser;