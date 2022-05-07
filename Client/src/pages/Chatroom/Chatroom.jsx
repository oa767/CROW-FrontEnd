import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {useHistory, useParams} from 'react-router-dom';
import {io} from 'socket.io-client';
import {setGlobalState, useGlobalState} from '../../state';
import {SocketContext} from '../../context/socket';

import './chatroom.css';

export default function Chatroom() { 
  const history = useHistory();
  const params = useParams();
  const roomID = params.roomID;

  const socket = useContext(SocketContext);

  const [username, setUsername] = useGlobalState('username');
  const [roomCode, setRoomCode] = useGlobalState('roomCode');
  const [userId, setUserId] = useGlobalState('userId');

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getRoomData = async() => {
    await axios.get('https://crow249.herokuapp.com/rooms/list')
      .then((response) => {
	if (response.data) {
	  for (var i = 0; i < response.data.length; ++i) {
            if (response.data[i]._id.$oid == roomID) {
              setData(response.data[i]);
              console.log(response.data[i]);
              setIsLoading(false);
            }
	  }
        }
      })
      .catch(error => {
	console.log(error);
      })
  }

  useEffect(() => {
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
