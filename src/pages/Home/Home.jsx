import React from 'react';
import {useHistory} from 'react-router-dom';

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
    <div className="content">
      <h1> CROW Chat </h1>
      <div>
        <p className="quote">"A list is only as strong as its weakest link"</p>
        <p className="quote-author">- Donald Knuth</p>
      </div>
      <button className="page-button">
	Create a Private Chat Room
      </button>
      <button
	onClick={() => navigateToPage('/usernameChoice')}
	className="page-button"
      >
	Join a Random Room
      </button>
      <button
        onClick={() => navigateToPage('/rooms')}
        className="page-button"
      >
        View All Rooms
      </button>
      <button
        onClick={() => navigateToPage('/users')}
        className="page-button"
      >
        View All Users
      </button> 
    </div>
  );
};

