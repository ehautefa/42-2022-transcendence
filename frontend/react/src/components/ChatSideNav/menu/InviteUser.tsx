import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { getAllUuidWithUserNameWithoutMe, getMyBlocked } from "../../../pages/allPlayers/request";
import { getMe } from "../../../pages/myProfile/request";
import "./sideMenu.css";
import Select from "react-select";


function InviteUser(me : any) {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [blocked, setBlocked] = useState([]);
    var selectOptions: any = [];

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

    async function fetchPlayers() {
        const users = await getAllUuidWithUserNameWithoutMe(me.userUuid);
        setUsers(users);
        const blocked = await getMyBlocked();
        setBlocked(blocked);
        for (let i = 0; i < users.length; i++) {
            if (!blocked.includes(users[i].userUuid)) 
                selectOptions.push({ value: users[i].userUuid, label: users[i].userName });
        }

    }

    useEffect(() => {
        fetchPlayers();
    }, []);


    return (<div className="Popup-mother">
        <button className="side-menu-button" onClick={() => setOpen(true)}>Invite User</button>
        <Popup open={open} closeOnDocumentClick onClose={() => {
            setOpen(false);
        }}>
            <div className='side-menu-popup'>
                <h3>Users</h3>
                <Select styles={customStyles} options={selectOptions} isMulti />
            </div>
        </Popup>
    </div>);
}

export default InviteUser;