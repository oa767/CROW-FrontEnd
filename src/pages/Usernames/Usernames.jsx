import {useHistory} from 'react-router-dom';
import React from 'react';

import './usernames.css';

const leftUsernames = ["Default #1", "Default #2", "Default #3", "Default #4", "Default #5"];
const rightUsernames = ["Default #6", "Default #7", "Default #8", "Default #9", "Default #10"];

function makeButtons() {
  var element = document.getElementById('left');

  for (var i = 0; i < leftUsernames.length; ++i) {
    let button = document.createElement('button');
    button.className = "username-item";     
    button.innerHTML = leftUsernames[i];
    element.append(button);
  }
  
  var newElement = document.getElementById('right');

  for (var j = 0; j < rightUsernames.length; ++j) {
    let button = document.createElement('button');
    button.className = "username-item";     
    button.innerHTML = rightUsernames[j];
    newElement.append(button);
  }
}

document.addEventListener("DOMContentLoaded", makeButtons);

export default function Username() {
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
        <div className="content user" id="left"></div>
        <div className="content user" id="right"></div>
      </div>
    </div>
  );
};
