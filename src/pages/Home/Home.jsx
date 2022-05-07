import {setGlobalState, useGlobalState} from '../../state';
import React, {useState, useEffect, useContext, useRef} from 'react';
import {SocketContext} from '../../context/socket';
import {useHistory} from 'react-router-dom';
import homeImage from './homeLogo.png';
import {io} from 'socket.io-client';
import axios from 'axios';

import './home.css';

export default function Home(){
  const history = useHistory();

  const [alertBoxOpen, setAlertBoxOpen] = useState(false);
  const [alert, setAlert] = useState(undefined);

  const [isPrivateModalOpen, setIsPrivateModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

  const [interest, setInterest] = useState('');
  const [interestsArray, setInterestsArray] = useState([]);

  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const socket = useContext(SocketContext);

  var path = '/chatroom/';

  const createRoom = async() => {
    await axios.post(`https://crow249.herokuapp.com/rooms/create/${roomName}`)
      .then(() => {
        console.log(`${roomName} created`);
      })
      .catch(error => {
        console.log(error.response.data.message);
        setAlert(error.response.data.message);
        localStorage.setItem("alert", "true");
	setRoomName('');
	setAlertBoxOpen(true);
      })
  }

  const createUser = async() => {
    await axios.post(`https://crow249.herokuapp.com/users/create/${username}`)
      .then(() => {
        console.log(`${username} created`);
      })
      .catch(error => {
        console.log(error.response.data.message);
        setAlert(error.response.data.message);
	localStorage.setItem("alert", "true");
	setUsername('');
	setAlertBoxOpen(true);
      })
  }

  const getRoomCode = (targetRoom) => {
    return axios.get(`https://crow249.herokuapp.com/rooms/${targetRoom}/id`);
  }   

  const getUserId = async() => {
    await axios.get('https://crow249.herokuapp.com/users/list') 
      .then((response) => {
	if (response.data) {
	  for (var i = 0; i < response.data.length; ++i) {
	    if (response.data[i].user_name === username) {
	      localStorage.setItem("userId", response.data[i]._id);
            }
          }
	}
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleJoinPrivateRoom = async() => {
    const room = await createRoom();
    if (JSON.parse(localStorage.getItem("alert")) === true) {
      localStorage.removeItem("alert");
      return;
    }

    const user = await createUser();
    if (JSON.parse(localStorage.getItem("alert")) === true) {
      localStorage.removeItem("alert");
      return;
    }

    const user_id = await getUserId();
    const code = await getRoomCode(roomName)
                   .catch((error) => { console.log(error); setAlert(error); });
    console.log(code.data);
    setRoomCode(code.data);
    socket.emit('joinPrivateRoom', username, localStorage.getItem("userId"), code.data);
    socket.on('joinPrivateRoom', (message) => {
      console.log(message);
      setGlobalState('userId', localStorage.getItem("userId"));
      localStorage.removeItem("userId");      
      setGlobalState('roomCode', code.data);
      setGlobalState('username', username);
      history.push(path.concat(code.data));
    })
  }

  const handleJoinWithCode = async() => {
    const user = createUser();
    if (JSON.parse(localStorage.getItem("alert")) === true) {
      localStorage.removeItem("alert");
      return;
    }

    const user_id = await getUserId();
    socket.emit('joinWithCode', username, localStorage.getItem("userId"), roomCode);
    socket.on('joinWithCode', (message) => {
      if (message === "success") {
	console.log(message);
        setGlobalState('userId', localStorage.getItem("userId"));
        localStorage.removeItem("userId");
        setGlobalState('roomCode', roomCode);
        setGlobalState('username', username);
        history.push(path.concat(roomCode));
      }	
      else {
        console.log(message);
	setRoomCode('');
        setAlert(message);
        setAlertBoxOpen(true);
      }
    })
  }

  const callJoinWithInterests = () => {
    console.log(interestsArray.join(","));
    axios.post(`https://crow249.herokuapp.com/rooms/join/interests/${username}?interests=${interestsArray.join(",")}`)
      .then((response) => {
 	console.log(Object.values(response.data).join(''));
        
        setIsInterestModalOpen(false);

 	sessionStorage.setItem('roomName', Object.values(response.data)[0]);
      })        
      .catch(error => {
        console.log(error);
	setAlert(error);
      })
  }

  const handleJoinWithInterests = async(e) => {
    if (interestsArray.length  >= 1) {
      await callJoinWithInterests();
      const code =  await axios.get(`https://crow249.herokuapp.com/rooms/${sessionStorage.getItem('roomName')}/id`)
			.catch((error) => {console.log(error); setAlert(error);});
      console.log(code.data);
      setRoomCode(code.date);
      setGlobalState('privateRoom', code.data);
      sessionStorage.removeItem('roomName');
      history.push(path.concat(code.data));
    }
    else {
      setUsername(username);
      setAlert("You must add at least one interest.");
      setAlertBoxOpen(true);
      e.preventDefault();
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlertBoxOpen(false);
      setAlert(undefined);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert])

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`User connected: ${socket.id}`);
    })
  }, []);

  return (
	  /* The home page has 4 key functions as the introduction to the website
		1. It shows users  a list of chat rooms that they can join, center of the screen	
		2. It gives them an option to create their own room, sidebar
		3. It gives them an option to create a private room, sidebar
		4. It shows them a list of user names they can choose from before entering any room.
			 */
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
      <div className="wrapper">
        <div className="topBar">
          <button 
	    onClick={() => setIsPrivateModalOpen(true)}
	    className="privateRoomButton"
	    style={{width: "21%"}}
	  >
            Create a Private Room
          </button>
          <div className="topBarTitle"> Crow </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="content homepage">
          {isPrivateModalOpen &&
            <div className="createRoomModal">
	      <form 
	        onSubmit={(e) => {
		  e.preventDefault();
		  handleJoinPrivateRoom();
		}}
	      >
	        <div className="modalContent">
                  <input
                    className="roomNameInput"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
		    required
                  />
                  <input
                    className="usernameInput"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
		    required
                  />
                  <div className="create-actions">
		    <input type="submit" className="button" value="Create Room" />
                    <button 
		      className="button" 
		      onClick={() => {
			setUsername('');
			setRoomName('');
			setIsPrivateModalOpen(false);
		      }}
		    > 
		      Cancel 
		    </button>
                  </div>
		</div>
              </form>
	    </div>
          }
          {isCodeModalOpen &&
            <div className="createRoomModal">
	      <form onSubmit={(e) => { e.preventDefault(); handleJoinWithCode(); }}>
                <div className="modalContent">
                  <input
                    className="roomNameInput"
                    placeholder="Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
		    required
                  />
	          <input
                    className="usernameInput"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
		    required
                  />
                  <div className="create-actions">
		    <input type="submit" className="button" value="Join Room" />
                    <button 
		      className="button" 
		      onClick={() => {
			setUsername('');
			setRoomCode('');
			setIsCodeModalOpen(false);
		      }}
		    > 
		      Cancel 
		    </button>
                  </div>
                </div>
	      </form>
            </div>
          }
	  {isInterestModalOpen &&
	    <div className="createRoomModal">
	      <form onSubmit={(e) => {handleJoinWithInterests(); e.preventDefault();}}>
       	        <div className="modalContent">
		  <input
                    className="usernameInput"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
		    required
                  />
		  <div className="create-actions">
		    <button
		      className="button"
		      onClick={handleJoinWithInterests}
		    >
		      Join Room
		    </button>
                    <button 
		      className="button" 
		      onClick={() => {
		        setInterest('');
		        setUsername('');
		        setInterestsArray([]);
	                setIsInterestModalOpen(false);
		      }}
		    > 
		      Cancel 
		    </button>
                  </div>
		  <input
                    className="roomNameInput"
                    placeholder="New Interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    id="newInterests"
                  />
		  <div className="create-actions">
                    <button
                      className="button"
                      onClick={() => {
                        setInterestsArray(() => [...interestsArray, interest]);
                        var value = document.getElementById('newInterests').value;
                        var list = document.getElementById('interestsList');
                        var newInterest = document.createElement('p');
                        newInterest.appendChild(document.createTextNode(value));
                        list.appendChild(newInterest);
                        setInterest('');
			sessionStorage.setItem("numInterests", list.childElementCount);
                      }}
                    >
                      Add Interest
                    </button>
		  </div>
		  <div className="interestsContainer" id="interestsList"></div>
                </div>
	      </form>
            </div>
          }
	  <div className="imageContainer">
	    <img src={homeImage} alt=""/>
  	  </div>
          <div className="buttonContainer">
            <button
	      onClick={() => history.push('/usernameChoice')}
	      className="homePageButton"
            >
	      Join a Random Room
            </button>
	    <button
	      onClick={() => setIsCodeModalOpen(true)}
	      className="homePageButton"
	    >
	      Join Room with Code
	    </button>
	    <button
	      onClick={() => setIsInterestModalOpen(true)}
	      className="homePageButton"
	    >
	      Join Room with Interests
	    </button>
            <button
              onClick={() => history.push('/rooms')}
              className="homePageButton"
            >
              View All Rooms
            </button>
            <button
              onClick={() => history.push('/users')}
              className="homePageButton"
            >
              View All Users
            </button> 
          </div>
        </div>
      </div>
    </>
  );
};

