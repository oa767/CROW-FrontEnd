import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

import RoomItem from '../../components/RoomItem/RoomItem';

import './rooms.css';

export default function Rooms() {
  const [rooms, setRooms] = useState(undefined);
  const [error, setError] = useState(undefined);

  const [refresh, setRefresh] = useState(undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);  

  const [newRoomName, setNewRoomName] = useState('');
  const [roomToDelete, setRoomToDelete] = useState('');
  const [roomToUpdate, setRoomToUpdate] = useState('');

  const history = useHistory();

  useEffect(() => {
    axios.get('https://crow249.herokuapp.com/rooms/list')
      .then((response) => {
        console.log(response.data);
        if (response.data){
          setRooms(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        setError(error);
      });
  }, [refresh])

  const handleCreateRoom = () => {
    axios.post(`https://crow249.herokuapp.com/rooms/create/${newRoomName}`)
      .then(() => {
        setIsModalOpen(false);
        setRefresh(refresh + 1);
      })
      .catch(error => {
        setError(error);
        console.log(error);
      })
  }
  
  const handleDeleteRoom = () => {
    axios.post(`https://crow249.herokuapp.com/rooms/delete/${roomToDelete}`)
      .then(() => {
        setIsModifyOpen(false);
        setRefresh(refresh + 1);
      })
      .catch(error => {
        setError(error);
        console.log(error);
      })
  }

  const handleChangeRoom = () => {
    axios.put(`https://crow249.herokuapp.com/rooms/update/${roomToUpdate}/${newRoomName}`)
      .then(() => {
        setIsUpdateOpen(false);
        setRefresh(refresh + 1);
      })
      .catch(error => {
        setError(error);
        console.log(error);
      })
  }

  return (
      <>
        <div className="rooms-header">
          <h1>Rooms</h1>
          <button
            onClick={() => history.push('/')}
            className="button"
          >
            {"<--"}Go Back Home
          </button>
        </div>

        {error && (
          <div className="rooms-error-box">
            <p>{error.toString()}</p>
          </div>
        )}

        <div className="rooms-list">
          {isModalOpen &&
            <div className="create-modal">
              <input
                className="room-input"
                placeholder="Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <div className="create-actions">
                <button className="button" onClick={handleCreateRoom}>Create New Room</button>
                <button className="button" onClick={() => setIsModalOpen(false)}> Cancel </button>
              </div>
            </div>
          }
          {isModifyOpen &&
            <div className="create-modal">
              <div className="create-actions">
                <button className="button" onClick={handleDeleteRoom}> Delete Room </button>
		<button 
		  className="button" 
		  onClick={() => {
		    setIsModifyOpen(false);
		    setIsUpdateOpen(true);
		  }}
		> 
		  Change Room Name 
		</button>
                <button className="button" onClick={() => setIsModifyOpen(false)}> Cancel </button>
              </div>
            </div>
          }
	  {isUpdateOpen &&
	    <div className="create-modal">
		<input
                  className="room-input"
                  placeholder="New Room Name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
	      <div className="create-actions">
	        <button className="button" onClick={handleChangeRoom}> Update Room </button>
		<button className="button" onClick={() => setIsUpdateOpen(false)}> Cancel </button>
	      </div>
	    </div>
	  }
          {rooms ? rooms.map((room, index) => (
	    <div
	      className="room-item"
	      key={`${room.room_name}-${index}`}
	      onClick={() => {
                setRoomToDelete(room.room_name);
		setRoomToUpdate(room.room_name);
                setIsModifyOpen(true);
              }}          
	    > 
              <p> {room.room_name} </p>
              <p> {room.num_users} </p>
            </div>
          )) : (
            <div className="rooms-empty">
              <p>Sorry there are no rooms right now... Come back later </p>
            </div>
          )}
      </div>
      <div style={{paddingBottom: "125px", width: "300px", alignItems: "center", margin: "auto", paddingTop: "20px"}}>
        <button className="page-button" onClick={() => setIsModalOpen(true)}> Add New Room </button>
      </div>
    </>
  )
}
