import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {useHistory, useParams} from 'react-router-dom';
import {useGlobalState} from '../../state';
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

  const [alert, setAlert] = useState(undefined);
  const [alertBoxOpen, setAlertBoxOpen] = useState(false);
  const [numUsers, setNumUsers] = useState(0);

  const getRoomData = async() => {
    await axios.get('https://crow249.herokuapp.com/rooms/list')
      .then((response) => {
	if (response.data) {
	  for (var i = 0; i < response.data.length; ++i) {
            if (response.data[i]._id.$oid === roomID) {
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
    getRoomData();
  }, []);

  useEffect(() => {
    socket.on("new user", () => {
      setAlert("New user joined");
      setAlertBoxOpen(true);
      setNumUsers(numUsers + 1);
    })
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlertBoxOpen(false);
      setAlert(undefined);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert]);

  return (
    <>
      {alertBoxOpen &&
        <div className="alertContainer">
          <div className="alert">
            <span
              className="closebtn"
              onClick={() => {
                setAlert(undefined);
                setAlertBoxOpen(false);
              }}
            >
              &times;
            </span>
            <strong> Alert! </strong> {alert.toString()}
          </div>
        </div>
      }
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
