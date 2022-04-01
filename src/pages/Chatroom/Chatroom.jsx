import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

import './chatroom.css';

export default function Chatroom() { 
  const roomName = localStorage.getItem('roomName');
  const username = localStorage.getItem('username');
  const roomCode = localStorage.getItem('roomCode');
 
  const [users, setUsers] = useState(undefined);

  const history = useHistory();

  const joinRoomGetUsers = async() => {
    await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
    axios.get(`https://crow249.herokuapp.com/users/list/${roomName}`)
      .then((response) => {
        console.log(response.data);
	setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    joinRoomGetUsers();
  }, []);

  return (
    <div className="content chatroom">
      <div className="sideBarContainer">
        <div className="topBar">
          <button
	    className="topBarTitle chatroom"
	    onClick={() => history.push('./')}
          >            
	    Crow
          </button>
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
      </div>
      <div className="chatContainer">
        <div className="topBar chat">
          <div className="roomName"> {roomName} </div>
          <h4 style={{color: "white", marginLeft: "225px"}}> {roomCode} </h4>
        </div>
        <div className="chatWindow"></div>
        <div className="chatbar">
          <input
	    className="chatInput"
            placeholder="Type a message"
          />
        </div>
      </div>
    </div>
  )
}
