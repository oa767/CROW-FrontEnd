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
  const [message, setMessage] = useState('');

  const [roomName, setRoomName] = useState('');

  const getRoomData = async() => {
    await axios.get('https://crow249.herokuapp.com/rooms/list')
      .then((response) => {
	if (response.data) {
	  for (var i = 0; i < response.data.length; ++i) {
            if (response.data[i]._id.$oid === roomID) {
              setData(response.data[i]);
              console.log(response.data[i]);
	      setRoomName(response.data[i].room_name);
	      console.log(response.data[i].room_name);
              setIsLoading(false);
            }
	  }
        }
      })
      .catch(error => {
	console.log(error);
      })
  }

  const sendMessage = () => {
    if (message.length >= 1) {
      socket.emit("send message", message, username, roomName, roomCode);
      socket.on("send message", (message) => {
        console.log(message);
	return;
      });
      var list = document.getElementById('chatwindow');
      var messageContainer = document.createElement('div');
      messageContainer.classList.add('messageContainer');
      var newMessage = document.createElement('div');
      newMessage.classList.add('message');
      newMessage.innerHTML = `<strong> You </strong>: ${message}`;
      newMessage.style.backgroundColor = "#" + sessionStorage.getItem("messageColor");
      messageContainer.appendChild(newMessage);
      list.appendChild(messageContainer);
      list.scrollTop = list.scrollHeight;
      setMessage('');
    }
    setMessage('');
  }

  useEffect(() => {
    socket.on("new user", (newUserName) => {
      setAlert(`New user ${newUserName} joined`);
      setAlertBoxOpen(true);
      setNumUsers(numUsers + 1);
    })
    socket.on("receive message", (sender, receivedMessage) => {
      var list = document.getElementById('chatwindow');
      var messageContainer = document.createElement('div');
      messageContainer.classList.add('messageContainer');
      var newMessage = document.createElement('div');
      newMessage.classList.add('message');
      newMessage.innerHTML = `<strong> You </strong>: ${receivedMessage}`;
      newMessage.style.backgroundColor = "#" + sessionStorage.getItem("messageColor");
      messageContainer.appendChild(newMessage);
      list.appendChild(messageContainer);
      list.scrollTop = list.scrollHeight;
      setMessage('');
    })
  });

  useEffect(() => {
    var color;
    do {
      color = Math.floor(Math.random()*16777215).toString(16);
      sessionStorage.setItem("messageColor", Math.floor(Math.random()*16777215).toString(16));
    }
    while (color == "000000");
  }, []);

  useEffect(() => {
    getRoomData();
  }, [numUsers]);

  useEffect(() => {
    if (!isLoading && username !== '' && roomCode != '' && userId != '') {
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("roomCode", roomCode);
      sessionStorage.setItem("userId", userId);
    }
  }, [isLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlertBoxOpen(false);
      setAlert(undefined);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [alert]);

  return (
    <>
      {alertBoxOpen &&
        <div className="alertContainer">
          <div className="alert" style={{backgroundColor: '#6ab68a'}}>
            <span
              className="closebtn"
              onClick={() => {
                setAlert(undefined);
                setAlertBoxOpen(false);
              }}
            >
              &times;
            </span>
            <strong> Notification: </strong> {alert.toString()}
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
              <div className="chatWindow" id="chatwindow"></div>
	      <form
	        onSubmit={(e) => {
		  e.preventDefault();		    
		  sendMessage(message);
                }}
	      >
		<div className="chatbar">
                  <input
	            className="chatInput"
                    placeholder="Type a message"
		    value={message}
		    onChange={(e) => setMessage(e.target.value)}
                  />
		  <button className="messageSubmit" type="submit"> Send </button>
		</div>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  )
}
