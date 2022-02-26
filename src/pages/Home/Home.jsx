import React from 'react';
import {useHistory} from 'react-router-dom';

import './home.css';

export default function Home(){
  const history = useHistory();

  function navigateToPage(path) {
    history.push(path);
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
          <button className="privateRoomButton">
            Create a Private Room
          </button>
        </div>
      </div>
      <div className="wrapper">
        <div className="content homepage">
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

