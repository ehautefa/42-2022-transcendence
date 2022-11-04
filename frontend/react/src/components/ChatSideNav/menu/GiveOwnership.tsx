import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import { getSocketChat } from "../../../Home";
import Select from "react-select";
import { SelectClass } from "./SelectClass"

function GiveOwnership({room}: any) {
    const socket = getSocketChat();
    const [open, setOpen] = useState(false);
    const [newOwner, setNewOwner] = useState("");
    const [users, setUsers] = useState([] as SelectClass[]);

    useEffect(() => {
        if (room.id !== "") {
            socket.emit("findAllUsersInRoom", {uuid: room.id}, (users: any) => {
                // console.log("GIVE OWNERSHIP", users);
                let selectTab: SelectClass[] = users.map((user: any) => new SelectClass(user));
                setUsers(selectTab);
            });
        }
    }, [room, socket]);

    const handleChange = (newValue: any) => {
        setNewOwner(newValue.value);
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
        const param = {
            userId: newOwner,
            roomId: room.id,
        }
        console.log("Give OwnerShip emit : ", param);
        socket.emit('giveOwnership', param);
        setOpen(false);
    }


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>Give Ownership</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {
            setOpen(false);
        }}>
            <div className='side-menu-popup'>
                <h3>Select New Owner</h3>
                <Select
                    onChange={handleChange}
                    styles={customStyles}
                    options={users} />
                <button onClick={Submit}>Give Ownership</button>
            </div>
        </Popup>
    </div>);
}

export default GiveOwnership;