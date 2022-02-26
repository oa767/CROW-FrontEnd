import React from 'react';
import {useHistory} from 'react-router-dom';

import './usernameChoice.css';
import '../Home/home.css';

export default function UsernameChoice() {
  const history = useHistory();
	
  function navigateToPage(path) {
    history.push(path);
  }

  return (
    <div className="content choice">
      <div>
	<button
          onClick={() => history.push('/')}
          className="button choice"
        >
          {"<--"}Go Back Home
        </button>
      </div>
      <h3> Let's pick a username </h3>
      <button className="page-button home">
        Choose for me
      </button>
      <button
        onClick={() => navigateToPage('/usernames')}
	className="page-button home"
      >
	Pick a Default Username
      </button>
      <button className="page-button home">
        Create my Own
      </button>		
    </div>
  );
};
