import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './chatroom.css';

export default function Chatroom() { 
  const roomName = localStorage.getItem('roomName');
  const username = localStorage.getItem('username');
  const roomCode = localStorage.getItem('roomCode');

  const [users, setUsers] = useState(undefined);

  const joinRoomGetUsers = async () => {
    try {
      const response = await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`);
      console.log(response);
    } catch(error) {
      console.log(error);
    }

    axios.get(`https://crow249.herokuapp.com/rooms/list`)
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i]._id.$oid == roomCode) {
            setUsers(response.data[i].list_users);
            console.log(response.data[i].list_users);
            break;
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    joinRoomGetUsers();
  }, []);

  return (
    <>
      <div className="wrapper">
	<div className="topBar">
	  <div className="roomName"> {roomName} </div>
	</div>
      </div>
      <div className="sidebar">
        <div className="sidebarContent">
	  {users ? users.map((user, index) => (
	    <div
	      key={`${user}-${index}`}
 	    >
	      <h3> {user} </h3>
            </div>
          )) : (
	    <h3></h3>
          )}
	</div>
      </div>
      <div className="chatbar">
        <input
	  className="chatInput"
          placeholder="Type a message"
        />
      </div>
      <div className="chatWindow"></div>
    </>
  )
}
