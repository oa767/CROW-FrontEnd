import {useHistory} from 'react-router-dom';
import React from 'react';

import './usernames.css';

export default function Username() {
  const leftUsernames = ["Default #1", "Default #2", "Default #3", "Default #4", "Default #5"];
  const rightUsernames = ["Default #6", "Default #7", "Default #8", "Default #9", "Default #10"];
  const history = useHistory();

  return (
	  /* Users on the website can select from a set of 10 different usernames 
	  before entering a room. If a user does not select a name before entering 
	  a room the website should give them a random one from this set of names. 
	  The random user name that is selected must be unique from all other users
	  in the chatroom.
	  	*/
    <div className="wrapper user">
      <div className="wrapper title">
        <h3> Choose a username </h3>
      </div>
      <div className="listWrapper">
        <div className="content user">
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
	<div className="content user">
          {rightUsernames.map((username) => (
            <div
              className="username-item"
              key={`${username}`}
              onClick={() => history.push('usernameChoice/usernames/chatroom')}
            >
              <p> {username} </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
