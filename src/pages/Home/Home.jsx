import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import './home.css';

export default function Home(){
  const history = useHistory();

  function navigateToPage(path) {
    history.push(path);
  }

  const [error, setError] = useState(undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');

  const handleCreateRoom = () => {
    localStorage.setItem('roomName', roomName);
    localStorage.setItem('username', username);
    setIsModalOpen(false);
    navigateToPage('/chatroom');
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
        </div>
      </div>
      <div className="wrapper">
        <div className="content homepage">
          {isModalOpen &&
            <div className="createRoomModal">
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
                <button className="button" onClick={handleCreateRoom}>Create Room</button>
                <button className="button" onClick={() => setIsModalOpen(false)}> Cancel</button>
              </div>
            </div>
          }
          <h1> CROW Chat </h1>
          <button
	    onClick={() => navigateToPage('/usernameChoice')}
	    className="page-button home"
          >
	    Join a Random Room
          </button>
          <button
            onClick={() => navigateToPage('/rooms')}
            className="page-button home"
          >
            View All Rooms
          </button>
          <button
            onClick={() => navigateToPage('/users')}
            className="page-button home"
          >
            View All Users
          </button> 
        </div>
      </div>
    </>
  );
};

