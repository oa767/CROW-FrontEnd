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
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");

  const [alert, setAlert] = useState(undefined);
  const [alertBoxOpen, setAlertBoxOpen] = useState(false);

  const path = '/chatroom/';

  const storeInfo = () => {
    sessionStorage.setItem("roomName", roomName);
    sessionStorage.setItem("roomCode", roomCode);
    sessionStorage.setItem("username", username);
  }

  const getUserId = async() => {
    await axios.get('https://crow249.herokuapp.com/users/list')
      .then((response) => {
        if (response.data) {
          for (var i = 0; i < response.data.length; ++i) {
            if (response.data[i].user_name === username) {
              sessionStorage.setItem("userId", response.data[i]._id.$oid);
              console.log(`userId ${response.data[i]._id.$oid}`);
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const createUserJoinRoom = async () => {
    await axios.post(`https://crow249.herokuapp.com/users/create/${username}`)
      .then(() => {
        console.log(`${username} created`);
      })
      .catch(error => {
        console.log(error.response.data.message);
        setAlert(error.response.data.message);
        setUsername('');
        setAlertBoxOpen(true);
      })
    
    getUserId();

    axios.post(`https://crow249.herokuapp.com/rooms/join/${roomCode}/${username}`)
      .then((response) => {
        console.log(response.data);
	storeInfo();
        navigateToPage(path.concat(roomCode));
      })
      .catch(error => {
        console.log(error);
      })
  }

  const getRooms = () => {
    return axios.get('https://crow249.herokuapp.com/rooms/list');
  }

  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getRooms()
			    .catch((error) => console.log(error));
      const randomRoom = rooms.data[Math.floor(Math.random()*rooms.data.length)];
      setRoomCode(randomRoom._id.$oid);
      setRoomName(randomRoom.room_name);
    }
    fetchRooms();
  }, [])

  return (
    <>
      {alertBoxOpen &&
        <div className="alertContainer">
          <div className="alert">
            <span
              className="closebtn"
              onClick={() => {
                setAlert(undefined);
                setAlertBoxOpen(false);
              }}
            >
              &times;
            </span>
            <strong> Alert! </strong> {alert.toString()}
          </div>
        </div>
      }
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
     	    <form onSubmit={(e) => {e.preventDefault(); createUserJoinRoom();}}>
	      <div className="modalContent">
                <input
                  className="usernameInput choice"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
		  required
     	        />
                <div className="create-actions">
  		  <input type="submit" className="button" value="Go To Room" />
                  <button 
		    className="button" 
		    onClick={() => {
		      setUsername('');
		      setIsModalOpen(false);
		    }}
		  > 
		    Cancel 
		  </button>
                </div>
	      </div>
            </form>
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
	    sessionStorage.setItem("roomCode", roomCode);
	    navigateToPage('/usernameChoice/usernames');
	  }}
	  className="homePageButton choice"
        >
	  Pick a Default Username
        </button>
        <button
	  onClick={() => {
	    setUsername('');
	    setIsModalOpen(true);
	  }}
	  className="homePageButton choice"
        >
          Create my Own
        </button>
      </div>	
    </>
  );
};
