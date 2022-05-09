import React, {useState, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import axios from 'axios';
import {io} from 'socket.io-client';

import './chatroom.css';

export default function Chatroom() { 
  const history = useHistory();
  const params = useParams();
  const roomID = params.roomID;

  const username = sessionStorage.getItem("username");
  const roomCode = sessionStorage.getItem("roomCode");
  const userId = sessionStorage.getItem("userId");
  const roomName = sessionStorage.getItem("roomName");

  const [socket, setSocket] = useState(null);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [alert, setAlert] = useState(undefined);
  const [alertBoxOpen, setAlertBoxOpen] = useState(false);
  const [numUsers, setNumUsers] = useState(0);
  const [message, setMessage] = useState('');

  const [authenticated, setAuthenticated] = useState(false);
  const [connected, setConnected] = useState(false);

  const sendMessage = () => {
    if (message.length >= 1) {
      socket.emit("send message", message, username, roomName, roomCode);
      socket.on("send message", (message) => {
        console.log(message);
        setAlert(message);
	setAlertBoxOpen(true);
	return;
      });

      var list = document.getElementById('chatwindow');
      var messageContainer = document.createElement('div');
      messageContainer.classList.add('messageContainerSend');
      var newMessage = document.createElement('div');
      newMessage.classList.add('message');
      newMessage.style.backgroundColor = "#4297e1";
      newMessage.innerHTML = `<strong> You </strong>: ${message}`;
      messageContainer.appendChild(newMessage);
      list.insertBefore(messageContainer, list.children[0]);
      list.scrollTop = list.scrollHeight;
      setMessage('');
    }
    setMessage('');
  }

  useEffect(function callback() {
    axios.get('https://crow249.herokuapp.com/rooms/list')
      .then((response) => {
        if (response.data) {
          for (var i = 0; i < response.data.length; ++i) {
            if (response.data[i]._id.$oid === roomID) {
              setData(response.data[i]);
   	      sessionStorage.setItem("roomName", response.data[i].room_name);
              console.log(response.data[i].room_name);
	      setIsLoading(false);
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
  }, [numUsers, roomID]);

  useEffect(() => {
      axios.get('https://crow249.herokuapp.com/users/list')
      .then((response) => {
        if (response.data) {
          for (var i = 0; i < response.data.length; ++i) {
            if (response.data[i]._id.$oid === userId) {
              setAuthenticated(true);
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
  }, [socket, numUsers, userId]);

  useEffect(() => {
    if (authenticated & !socket) {
      setSocket(io("https://crow-frontend.herokuapp.com"));
      setConnected(true);
    }
  }, [authenticated]);

  useEffect(() => {
    if (authenticated && connected) {
      socket.emit("joining room", userId, username, roomCode, roomName);
    }
  }, [socket, authenticated, connected]);

  useEffect(() => {
    if (socket) {
      socket.on("new user", (newUserName) => {
        setAlert(`'${newUserName}' has joined this room`);
        setAlertBoxOpen(true);       
        setNumUsers(numUsers => numUsers + 1);
      })
      socket.on("receive message", (sender, receivedMessage) => {
        var list = document.getElementById('chatwindow');
        var messageContainer = document.createElement('div');
        messageContainer.classList.add('messageContainerReceive');
        var newMessage = document.createElement('div');
        newMessage.classList.add('message');
        newMessage.style.backgroundColor = "#50a368"
        newMessage.innerHTML = `<strong> ${sender} </strong>: ${receivedMessage}`;
        messageContainer.appendChild(newMessage);
        list.insertBefore(messageContainer, list.children[0]);
        list.scrollTop = list.scrollHeight;
        setMessage('');
      })
      socket.on("inactive", () => {
        setAlert("You are about to be removed due to inactivity. Send a message to stay active");
        setAlertBoxOpen(true);
        axios.put(`https://crow249.herokuapp.com/users/remove/${username}/${roomName}`)
	  .then((response) => {
	    console.log(response);
	    socket.emit("remove inactive");
	    setNumUsers(numUsers => numUsers - 1);
	    history.push('/');
          })
	  .catch(error => {
	    console.log(error);
          })		
      })
      socket.on("inactive left", (inactiveUser) => {
	setAlert(`${inactiveUser} has been removed due to inactivity`);
	setAlertBoxOpen(true);
      })
      socket.on("user left", (departingUser) => {
        setAlert(`${departingUser} has left the room`);
        setAlertBoxOpen(true);
      })
      return () => {
        socket.removeAllListeners();
      }
    }
  }, [socket]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlertBoxOpen(false);
      setAlert(undefined);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert]);

  useEffect(() => {
    if (authenticated && connected) {
      const interval = setInterval(() => {
        socket.emit("check activity");
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [socket, authenticated, connected]);
    
  useEffect(() => {
    return () => socket.disconnect();
  }, []);

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
      {!isLoading && authenticated &&
        <div className="content chatroom">
          <div className="topBarContainer">
            <div className="topBar">
              <button
                className="topBarTitle chatroom"
                onClick={() => { socket.disconnect(); history.push('/');}}
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
