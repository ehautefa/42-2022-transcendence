import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import { getSocketChat } from "../../../App";
import Select from "react-select";
import { SelectClass } from "./SelectClass"
import { Room } from "../../../type";

function UnpunishUser(param: any) {
    const socket = getSocketChat();
    const [open, setOpen] = useState(false);
    const [newPunish, setNewPunish] = useState("");
    const [users, setUsers] = useState([] as SelectClass[]);

    let room: Room = param.room;
    let ban: boolean = param.ban;

    useEffect(() => {
        if (room.id !== "") {
            if (ban) {
                socket.emit("findMutedUsersInRoom", { uuid: room.id }, (users: any) => {
                    let selectTab: SelectClass[] = users.map((user: any) => new SelectClass(user.user));
                    setUsers(selectTab);
                });
            } else {
                socket.emit("findBannedUsersInRoom", { uuid: room.id }, (users: any) => {
                    let selectTab: SelectClass[] = users.map((user: any) => new SelectClass(user.user));
                    setUsers(selectTab);
                });
            }
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
            unMute: !ban
        }
        console.log("remove punishement", param);
        socket.emit('removePunishment', param);
        setOpen(false);
    }


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>
            {
                ban ?
                    "Unban user" :
                    "Unmute user"
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
                {
                    ban ?
                        <button onClick={Submit}>Unban user</button> :
                        <button onClick={Submit}>Unmute user</button>
                }
            </div>
        </Popup>
    </div>);
}

export default UnpunishUser;