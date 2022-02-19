import React from 'react';
import {useHistory} from 'react-router-dom';

import './usernameChoice.css';

export default function UsernameChoice() {
  const history = useHistory();
	
  function navigateToPage(path) {
    history.push(path);
  }

  return (
    <>
      <div>
	<button
          onClick={() => history.push('/')}
          className="button"
        >
          {"<--"}Go Back Home
        </button>
      </div>
      <div className="question">
	<h3> How would you like to choose your username? </h3>
      </div>
      <div className="content">
	<button className="page-button">
	  Choose for me
	</button>
	<button
	  onClick={() => navigateToPage('/usernames')}
	  className="page-button"
	>
	  Pick a Default Username
	</button>
	<button className="page-button">
	  Create my Own
	</button>		
      </div>
    </>
  );
};
