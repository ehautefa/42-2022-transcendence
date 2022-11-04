import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./sideMenu.css";
import Select from "react-select";
import { SelectClass } from "./SelectClass"
import { Room } from "../../../type";
import { getSocketChat } from "../../../Home";



function InviteUser(param: any) {
    const socket = getSocketChat();
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([] as SelectClass[]);
    const [selectedUser, setSelectedUser] = useState();

    let room: Room = param.room;

    useEffect( () => {
        socket.emit('findAllInvitableUsers', {uuid: room.id}, (users:any) => {
          let selectTab: SelectClass[] = users.map((user: any) => new SelectClass(user));
          setUsers(selectTab);  
        });
    }, [room, socket]);

  const handleChange = (newValue: any) => {
      setSelectedUser(newValue.value);
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
          userId: selectedUser,
          roomId: room.id,
      }
      socket.emit('inviteUser', param);
      setOpen(false);
  }


  return (<div className="Popup-mother">
      <button className="side-menu-button" onClick={() => setOpen(true)}>
          {"Invite User"}
      </button>
      <Popup open={open} closeOnDocumentClick onClose={() => {
          setOpen(false);
      }}>
          <div className='side-menu-popup'>
              <h3>Select User</h3>
              <Select
                  onChange={handleChange}
                  styles={customStyles}
                  options={users} />
              <button onClick={Submit}>Invite user</button>
          </div>
      </Popup>
  </div>);
}

export default InviteUser;