import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import homeImage from './homeLogo.png';

import './home.css';

export default function Home(){
  const history = useHistory();

  function navigateToPage(path) {
    history.push(path);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const [interest, setInterest] = useState('');
  const [interestsArray, setInterestsArray] = useState([]);

  const path = '/chatroom/';

  const handleCreateRoomUser = async() => {
    await axios.post(`https://crow249.herokuapp.com/rooms/create/${roomName}`)
      .then((response) => {
	console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
    axios.post(`https://crow249.herokuapp.com/users/create/${username}`)
      .then((response) => {
	console.log(response.data);
	setIsModalOpen(false);	
      })
      .catch(error => {
        console.log(error);
      })
    return axios.get(`https://crow249.herokuapp.com/rooms/${roomName}/id`)
  }

  const joinPrivateRoom = async() => {
    const code = await handleCreateRoomUser()
			.catch((error) => console.log(error));
    console.log(code.data);
    sessionStorage.setItem('privateRoom', true);
    sessionStorage.setItem('newUser', true);
    sessionStorage.setItem('username', username);
    console.log(path.concat(code.data));
    navigateToPage(path.concat(code.data));
  }

  const handleJoinWithCode = () => {
    axios.post(`https://crow249.herokuapp.com/users/create/${username}`)
      .then((response) => {
        console.log(response.data);
        setIsCodeModalOpen(false);
	sessionStorage.setItem('username', username);
        sessionStorage.setItem('privateRoom', true);
        sessionStorage.setItem('newUser', true);
        console.log(path.concat(roomCode))
        navigateToPage(path.concat(roomCode));
      })
      .catch(error => {
        console.log(error);
      })
  }

  const callJoinWithInterests = () => {
    console.log(interestsArray.join(","));
    axios.post(`https://crow249.herokuapp.com/rooms/join/interests/${username}?interests=${interestsArray.join(",")}`)
      .then((response) => {
	console.log(Object.values(response.data).join(''));
	setIsInterestModalOpen(false);
	sessionStorage.setItem('username', username);
        sessionStorage.setItem('privateRoom', false);
        sessionStorage.setItem('newUser', true);
 	sessionStorage.setItem('roomName', Object.values(response.data)[0]);
      })        
      .catch(error => {
        console.log(error);
      })
  }

  const handleJoinWithInterests = async() => {
    await callJoinWithInterests();
    const code =  await axios.get(`https://crow249.herokuapp.com/rooms/${sessionStorage.getItem('roomName')}/id`)
			.catch((error) => console.log(error));
    console.log(code.data);
    sessionStorage.removeItem('roomName');
    console.log(path.concat(code.data));
    navigateToPage(path.concat(code.data));
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
	    style={{width: "21%"}}
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
                  <button className="button" onClick={handleJoinWithCode}> Join Room </button>
                  <button className="button" onClick={() => setIsCodeModalOpen(false)}> Cancel </button>
                </div>
              </div>
            </div>
          }
	  {isInterestModalOpen &&
	    <div className="createRoomModal">
	      <div className="modalContent">
	        <input
		  className="roomNameInput"
		  placeholder="New Interest"
		  value={interest}
		  onChange={(e) => setInterest(e.target.value)}
 		  id="newInterests"
		/>
		<input
                  className="usernameInput"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
		<div className="create-actions">
	   	  <button
		    className="button"
		    onClick={() => {
		      setInterestsArray(() => [...interestsArray, interest]);
		      var value = document.getElementById('newInterests').value;
                      var list = document.getElementById('interestsList');
    		      var newInterest = document.createElement('p');
 		      newInterest.appendChild(document.createTextNode(value));
		      list.appendChild(newInterest);
		      setInterest('');
   		    }}
    	          >
		    Add Interest
		  </button>
	          <button
		    className="button"
		    onClick={handleJoinWithInterests}
 		  >
		    Join Room
   		  </button>
                  <button 
		    className="button" 
		    onClick={() => {
		      setInterest('');
		      setUsername('');
		      setInterestsArray([]);
	              setIsInterestModalOpen(false);
		    }}
		  > 
		    Cancel 
		  </button>
                </div>
		<div className="interestsContainer" id="interestsList"></div>
              </div>
            </div>
          }
	  <div className="imageContainer">
	    <img src={homeImage} />
  	  </div>
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
	      onClick={() => setIsInterestModalOpen(true)}
	      className="homePageButton"
	    >
	      Join Room with Interests
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

