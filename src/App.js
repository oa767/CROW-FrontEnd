import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {SocketContext, socket} from './context/socket';

import Home from './pages/Home/Home';
import Rooms from './pages/Rooms/Rooms';
import Users from './pages/Users/Users';
import Usernames from './pages/Usernames/Usernames';
import UsernameChoice from './pages/UsernameChoice/UsernameChoice';
import Chatroom from './pages/Chatroom/Chatroom';

import './App.css';

function App() {
  return (
	  /* Interface for the website
	  Goals:
	  	-Sidebar for buttons
		-chatrooms in the middle
	  */
    <SocketContext.Provider value={socket}>
      {socket &&
        <div className="root">
          <div className="content">
            <Router>
              <Switch>
                <Route exact={true} path={'/'}>
                  <Home />
                </Route>
                <Route exact={true} path={'/rooms'}>
                  <Rooms />
                </Route>
                <Route exact={true} path={'/users'}>
                  <Users />
                </Route>
    	        <Route exact={true} path={'/usernameChoice/usernames'}>
	          <Usernames />
                </Route>
                <Route exact={true} path={'/usernameChoice'}>
	          <UsernameChoice />
	        </Route>
                <Route path={'/chatroom/:roomID'}>
                  <Chatroom />
                </Route>
              </Switch>
            </Router>
          </div>
        </div>
      }
    </SocketContext.Provider>
  );
}

export default App;
