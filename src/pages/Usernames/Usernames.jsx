import {useHistory} from 'react-router-dom';
import React, {useState} from 'react';
import axios from 'axios';

import './usernames.css';

export default function Username() {
  const leftUsernames = ["Crow", "Owl", "Raven", "Eagle", "Sparrow"];
  const rightUsernames = ["Penguin", "Flamingo", "Crane", "Hummingbird", "Dove"];

  const history = useHistory();

  const roomCode = sessionStorage.getItem("roomCode");
  const [chosenName, setChosenName] = useState(undefined);

  const path = '/chatroom/';

  const createUserJoinRoom = () => {
    axios.post(`https://crow249.herokuapp.com/users/create/${sessionStorage.getItem("username")}`)
      .then((response) => {
        console.log(response.data);
        sessionStorage.setItem('privateRoom', false);
        sessionStorage.setItem('newUser', true);
      })
      .catch(error => {
        console.log(error);
      })
    axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${sessionStorage.getItem("username")}`)
      .then((response) => {
        console.log(response.data);
        console.log(path.concat(roomCode));
        sessionStorage.removeItem('roomCode');
        history.push(path.concat(roomCode));
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
	  /* Users on the website can select from a set of 10 different usernames 
	  before entering a room. If a user does not select a name before entering 
	  a room the website should give them a random one from this set of names. 
	  The random user name that is selected must be unique from all other users
	  in the chatroom.
    	  	*/
    <>
      <div style={{paddingTop: "150px", paddingBottom: "20px"}}>
        <button
          onClick={() => history.push('./')}
          className="button usernames"
        >
          {"<--"}Go Back
        </button>
      </div>

      <h3 style={{color: "white", textAlign: "center"}}> Choose a Username </h3>

      <div className="listContainer">
        <div className="buttonContainer usernames">
	  {leftUsernames.map((username) => (
	    <div 
	      className="username-item"
	      key={`${username}`}
	      onClick={() => {
		console.log(username);
 		sessionStorage.setItem("username", username);
		createUserJoinRoom();		
	      }}
	    >
	      <p> {username} </p>
	    </div>
          ))}
        </div>	
	<div className="buttonContainer usernames">
          {rightUsernames.map((username) => (
            <div
              className="username-item"
              key={`${username}`}
              onClick={() => {
		console.log(username);
		sessionStorage.setItem("username", username);
                createUserJoinRoom();
              }}
            >
              <p> {username} </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
