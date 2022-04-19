import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useHistory, useParams} from 'react-router-dom';

import './chatroom.css';

export default function Chatroom() { 
  const history = useHistory();
  const params = useParams();
  const roomID = params.roomID;

  const username = sessionStorage.getItem('username');

  const [data, setData] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(JSON.parse(sessionStorage.getItem('privateRoom')));
  const [isNewUser, setIsNewUser] = useState(JSON.parse(sessionStorage.getItem('newUser')));
  const [isNewRoom, setIsNewRoom] = useState(true);

  const joinRoom = async() => {
    if (isPrivate && isNewUser && isNewRoom) {
      await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomID}/${username}`)
        .then((response) => {
          console.log(response.data);
	  setIsNewUser(false);
	  sessionStorage.setItem('newUser', false);
	  setIsNewRoom(false);
        })
        .catch(error => {
          console.log(error);
        })
    } else if (isPrivate && isNewUser && !isNewRoom) {
      await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomID}/${username}`)
        .then((response) => {
          console.log(response.data);
	  setIsNewUser(false);
          sessionStorage.setItem('newUser', false);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
  
  const getRoomData = async() => {
    await axios.get('https://crow249.herokuapp.com/rooms/list')
      .then((response) => {
	for (var i = 0; i < response.data.length; ++i) {
          if (response.data[i]._id.$oid == roomID) {
            setData(response.data[i]);
            /*console.log(response.data[i]);*/
            setIsLoading(false);
          }
        }
      })
      .catch(error => {
	console.log(error);
      })
  }

  useEffect(() => {
    joinRoom();
    getRoomData();

    const interval = setInterval(() => {
      getRoomData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!isLoading &&
        <div className="content chatroom">
          <div className="topBarContainer">
            <div className="topBar">
              <button
                className="topBarTitle chatroom"
                onClick={() => history.push('/')}
              >
                Crow
              </button>
	      <div className="roomName"> {data.room_name} </div>
	      {isPrivate && <div className="roomCode"> {data._id.$oid} </div>}
	      {!isPrivate && <div className="roomCode" style={{width: "42.6vmin"}}></div>}
            </div>
          </div>
	  <div className="content chatBody">
            <div className="sideBarContainer">
              <div className="sidebar">
                <div className="sidebarContent">
                  {data.list_users ? data.list_users.map((user, index) => (
                    <div
                      key={`${user}-${index}`}
                    >
                      <p> {user} </p>
                    </div>
                  )) : (
                    <p></p>
                  )}
                </div>
              </div>
            </div>
            <div className="chatContainer">
              <div className="chatWindow"></div>
              <div className="chatbar">
                <input
	          className="chatInput"
                  placeholder="Type a message"
                />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}
