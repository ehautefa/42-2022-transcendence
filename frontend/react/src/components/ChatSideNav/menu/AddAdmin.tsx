import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import { getSocketChat } from "../../../App";
import Select from "react-select";

function AddAdmin({room} : any) {
    const socketChat = getSocketChat();
    const [open, setOpen] = useState(false);
    const param = {
        roomId: room.id,
        admin: false,
        banned: false,
        muted: false,
    }

    useEffect(() => {
        console.log("AddAdmin useEffect");
        socketChat.emit("filterUsersInRoom", param ,(users: any) => {
            console.log("AddAdmin users", users);
        });
    }, []);


    const customStyles = {
        option: (provided: any, state: any) => ({
          ...provided,
          borderBottom: '1px dotted pink',
          color: state.isSelected ? 'red' : 'blue',
          padding: 20,
        }),
        control: () => ({
          // none of react-select's styles are passed to <Control />
          width: 200,
        }),
        singleValue: (provided: any, state: any) => {
          const opacity = state.isDisabled ? 0.5 : 1;
          const transition = 'opacity 300ms';
      
          return { ...provided, opacity, transition };
        }
      }


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>Add Admin</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {
            setOpen(false);
        }}>
            <div className='side-menu-popup'>
                <h3>Select Users</h3>
                {/* <Select styles={customStyles} options={selectOptions} isMulti /> */}
                {/* <button onClick={Submit}>Send Invitation</button> */}
            </div>
        </Popup>
    </div>);
}

export default AddAdmin;