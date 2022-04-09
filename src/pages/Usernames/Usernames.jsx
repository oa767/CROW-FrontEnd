import {useHistory} from 'react-router-dom';
import React from 'react';

import './usernames.css';

export default function Username() {
  const leftUsernames = ["Crow", "Owl", "Raven", "Eagle", "Sparrow"];
  const rightUsernames = ["Penguin", "Flamingo", "Crane", "Hummingbird", "Dove"];

  const history = useHistory();

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
	      onClick={() => history.push('/chatroom')}
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
              onClick={() => history.push('/chatroom')}
            >
              <p> {username} </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
