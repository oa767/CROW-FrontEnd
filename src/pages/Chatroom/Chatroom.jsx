import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useHistory, useParams} from 'react-router-dom';

import './chatroom.css';

export default function Chatroom() { 
  const history = useHistory();
  const params = useParams();
  const roomID = params.roomID;

  const [data, setData] = useState(undefined);
  const [rooms, setRooms] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getRoomData = async() => {
    await axios.get('https://crow249.herokuapp.com/rooms/list')
      .then((response) => {
	setRooms(response.data);
	console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(async() => {
    const getRooms = await getRoomData();
    for (var i = 0; i < rooms.length; ++i) {
      if (rooms[i]._id.$oid == roomID) {
        setData(rooms[i]);
        console.log(rooms[i]);
        setIsLoading(false);
        break;
      }
    }
  }, [])

  return (
    <>
    {!isLoading && (
    <div className="content chatroom">
      <div className="sideBarContainer">
        <div className="topBar">
          <button
	    className="topBarTitle chatroom"
	    onClick={() => history.push('/')}
          >            
	    Crow
          </button>
        </div>
        <div className="sidebar">
          <div className="sidebarContent">
            {data.list_users ? data.list_users.map((user, index) => (
              <div
                key={`${user}-${index}`}
              >
                <h3> {user} </h3>
              </div>
            )) : (
              <h3></h3>
            )}
          </div>
        </div>
      </div>
      <div className="chatContainer">
        <div className="topBar chat">
          <div className="roomName"> {data.room_name} </div>
          <h4 style={{color: "white", marginLeft: "225px"}}> {data._id.$oid} </h4>
        </div>
        <div className="chatWindow"></div>
        <div className="chatbar">
          <input
	    className="chatInput"
            placeholder="Type a message"
          />
        </div>
      </div>
    </div>
    )}
    </>
  )
}
