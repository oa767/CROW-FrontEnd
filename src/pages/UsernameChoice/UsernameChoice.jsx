import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';


import './usernameChoice.css';
import '../Home/home.css';

export default function UsernameChoice() {
  const usernames = ["Crow", "Owl", "Raven", "Eagle", "Sparrow", "Penguin", "Flamingo", "Crane", "Hummingbird", "Dove"];
  const history = useHistory();

  var randomUsername = usernames[Math.floor(Math.random()*usernames.length)];

  function navigateToPage(path) {
    history.push(path);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState(randomUsername);
  const [randomRoom, setRandomRoom] = useState("");

  const path = '/chatroom/';

  const createUserJoinRoom = () => {
    axios.post(`https://crow249.herokuapp.com/users/create/${username}`)
      .then((response) => {
	console.log(response.data);
        setIsModalOpen(false);
 	sessionStorage.setItem('username', username);
        sessionStorage.setItem('privateRoom', false);
        sessionStorage.setItem('newUser', true);
      })
      .catch(error => {
        console.log(error);
      })
    axios.post(`https://crow249.herokuapp.com/rooms/join/${randomRoom}/${username}`)
      .then((response) => {
        console.log(response.data);
	console.log(path.concat(randomRoom))
        navigateToPage(path.concat(randomRoom));
      })
      .catch(error => {
        console.log(error);
      })
  }

  const getRooms = () => {
    return axios.get('https://crow249.herokuapp.com/rooms/list');
  }

  useEffect(async() => {
    const rooms = await getRooms()
			.catch((error) => console.log(error));

    setRandomRoom(rooms.data[Math.floor(Math.random()*rooms.data.length)]._id.$oid);
  }, [])

  return (
    <>
      <div style={{paddingTop: "150px", paddingBottom: "20px"}}>
	<button
          onClick={() => history.push('/')}
          className="button choice"
        >
          {"<--"}Go Back Home
        </button>
      </div>
      <h3 style={{color: "white", textAlign: "center"}}> Let's pick a username </h3>
      <div className="buttonContainer choice">
        {isModalOpen &&
          <div className="createUsernameModal">
            <input
              className="usernameInput"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
	    />
            <div className="create-actions">
              <button className="button" onClick={createUserJoinRoom}> Go To Room </button>
              <button className="button" onClick={() => setIsModalOpen(false)}> Cancel </button>
            </div>
          </div>
        }
        <button
	  onClick={createUserJoinRoom}
	  className="homePageButton choice"
	>
          Choose for me
        </button>
        <button
          onClick={() => {
	    sessionStorage.setItem("roomCode", randomRoom);
	    navigateToPage('/usernameChoice/usernames');
	  }}
	  className="homePageButton choice"
        >
	  Pick a Default Username
        </button>
        <button
	  onClick={() => setIsModalOpen(true)} 
	  className="homePageButton choice"
        >
          Create my Own
        </button>
      </div>	
    </>
  );
};
