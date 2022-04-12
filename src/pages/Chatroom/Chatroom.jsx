import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useHistory, useParams} from 'react-router-dom';

import './chatroom.css';

export default function Chatroom() { 
  const history = useHistory();
  const params = useParams();
  const roomID = params.roomID;

  const username = localStorage.getItem('username');

  const [data, setData] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(JSON.parse(localStorage.getItem('privateRoom')));
  const [isNewUser, setIsNewUser] = useState(JSON.parse(localStorage.getItem('newUser')));
  const [isNewRoom, setIsNewRoom] = useState(true);

  const joinRoom = async() => {
    if (isPrivate && isNewUser && isNewRoom) {
      await axios.post(`https://crow249.herokuapp.com/rooms/join/${roomID}/${username}`)
        .then((response) => {
          console.log(response.data);
	  setIsNewUser(false);
	  localStorage.setItem('newUser', false);
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
          localStorage.setItem('newUser', false);
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
            console.log(response.data[i]);
            setIsLoading(false);
          }
        }
      })
      .catch(error => {
	console.log(error);
      })
  }

  useEffect(async() => {
    await joinRoom()
      .catch((error) => {
	console.log(error);
      })
    await getRoomData()
      .catch((error) => {
        console.log(error);
      })
  }, []);

  return (
    <>
      {!isLoading &&
        <div className="content chatroom">
          <div className="sideBarContainer">
            <div className="topBar">
              <button
	        className="topBarTitle chatroom"
	        onClick={() => history.push('/')}
              >            
	        Crow
              </button>
            </div>
            <div className="sidebar">
              <div className="sidebarContent">
                {data.list_users ? data.list_users.map((user, index) => (
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
              <div className="roomName"> {data.room_name} </div>
              {isPrivate && <h4 style={{color: "white", width: "250px"}}> {data._id.$oid} </h4>}
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
      }
    </>
  )
}
