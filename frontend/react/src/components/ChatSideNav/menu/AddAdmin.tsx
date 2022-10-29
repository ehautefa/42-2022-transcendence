import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import { getSocketChat } from "../../../App";
import Select from "react-select";
import { SelectClass } from "./toolsBox"
import { User } from "../../../type"

function AddAdmin({ room }: any) {
    const socketChat = getSocketChat();
    const [open, setOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState("");
    const [users, setUsers] = useState([] as SelectClass[]);
    
    useEffect(() => {
        console.log("AddAdmin useEffect: room: ", room)
        const param = {
            roomId: room.id,
            isAdmin: true,
        }
        socketChat.emit("filterByAdminRightsInRoom", param, (users: any) => {
            let selectTab: SelectClass[] = users.map((user: any) => new SelectClass(user.user));
            setUsers(selectTab);
        });
    }, [room]);

    const handleChange = (newValue: any) => {
		setNewAdmin(newValue.value);
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
			userId: newAdmin,
			roomId: room.id,
            isAdmin: false
		}
		console.log("Add Admin : ", param);
		socketChat.emit('setAdmin', param);
		setOpen(false);
	}


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>Add Admin</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {
            setOpen(false);
        }}>
            <div className='side-menu-popup'>
                <h3>Select Users</h3>
                <Select
                    onChange={handleChange}
                    styles={customStyles}
                    options={users} />
                <button onClick={Submit}>Give Admin right</button>
            </div>
        </Popup>
    </div>);
}

export default AddAdmin;