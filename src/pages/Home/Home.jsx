import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import './home.css';

export default function Home(){
  const history = useHistory();

  function navigateToPage(path) {
    history.push(path);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoomUser = async() => {
    await axios.post(`https://crow249.herokuapp.com/rooms/create/${roomName}`)
      .then(() => {
        localStorage.setItem('roomName', roomName);
      })
      .catch(error => {
        console.log(error);
      })
    axios.post(`https://crow249.herokuapp.com/users/create/${username}`)
      .then(() => {
        localStorage.setItem('username', username);
        setIsModalOpen(false);
        localStorage.setItem('private room', true);
      })
      .catch(error => {
        console.log(error);
      })
    axios.get(`https://crow249.herokuapp.com/rooms/${roomName}/id`)
      .then((response) => {
        localStorage.setItem('roomCode', response.data);
        setRoomCode(response.data);
	navigateToPage('/chatroom');
      })
      .catch(error => {
        console.log(error);
      })
  }

  const joinPrivateRoom = async() => {
    const createRoomUser = await handleCreateRoomUser();
    axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleJoinWithCode = () => {
    axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`)
      .then((response) => {
        localStorage.setItem('roomCode', roomCode);
        localStorage.setItem('username', username);
        localStorage.setItem('private room', true);
        navigateToPage('/chatroom');
      })
      .catch(error => {
        console.log(error);
      })
  }
  
  return (
	  /* The home page has 4 key functions as the introduction to the website
		1. It shows users  a list of chat rooms that they can join, center of the screen	
		2. It gives them an option to create their own room, sidebar
		3. It gives them an option to create a private room, sidebar
		4. It shows them a list of user names they can choose from before entering any room.
			 */
    <>
      <div className="wrapper">
        <div className="topBar">
          <button 
	    onClick={() => setIsModalOpen(true)}
	    className="privateRoomButton"
	  >
            Create a Private Room
          </button>
          <div className="topBarTitle"> Crow </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="content homepage">
          {isModalOpen &&
            <div className="createRoomModal">
	      <div className="modalContent">
                <input
                  className="roomNameInput"
                  placeholder="Room Name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <input
                  className="usernameInput"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="create-actions">
                  <button className="button" onClick={joinPrivateRoom}> Create Room </button>
                  <button className="button" onClick={() => setIsModalOpen(false)}> Cancel </button>
                </div>
              </div>
	    </div>
          }
          {isCodeModalOpen &&
            <div className="createRoomModal">
              <div className="modalContent">
                <input
                  className="roomNameInput"
                  placeholder="Room Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
	        <input
                  className="usernameInput"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="create-actions">
                  <button className="button" onClick={handleJoinWithCode}> Create Room </button>
                  <button className="button" onClick={() => setIsCodeModalOpen(false)}> Cancel </button>
                </div>
              </div>
            </div>
          }
  	  <div className="homeImage"></div>
          <div className="buttonContainer">
            <button
	      onClick={() => navigateToPage('/usernameChoice')}
	      className="homePageButton"
            >
	      Join a Random Room
            </button>
	    <button
	      onClick={() => setIsCodeModalOpen(true)}
	      className="homePageButton"
	    >
	      Join Room with Code
	    </button>
            <button
              onClick={() => navigateToPage('/rooms')}
              className="homePageButton"
            >
              View All Rooms
            </button>
            <button
              onClick={() => navigateToPage('/users')}
              className="homePageButton"
            >
              View All Users
            </button> 
          </div>
        </div>
      </div>
    </>
  );
};

