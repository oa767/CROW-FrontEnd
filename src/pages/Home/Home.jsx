import React from 'react';
import {useHistory} from 'react-router-dom';

export default function Home(){
  const history = useHistory();

  function navigateToPage(path) {
    history.push(path);
  }

  return (
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
	onClick={() => navigateToPage('/usernames')}
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

