import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './pages/Home/Home';
import Rooms from './pages/Rooms/Rooms';
import Users from './pages/Users/Users';
import Usernames from './pages/Usernames/Usernames';
import UsernameChoice from './pages/UsernameChoice/UsernameChoice';

import './App.css';

function App() {
  return (
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
						<Route exact={true} path={'/usernames'}>
							<Usernames />
						</Route>
	    			<Route exact={true} path={'/usernameChoice'}>
	      			<UsernameChoice />
	    			</Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
